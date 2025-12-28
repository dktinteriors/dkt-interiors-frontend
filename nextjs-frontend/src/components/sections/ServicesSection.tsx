'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { Reveal, Magnetic } from '@/components/animations';
import { useReducedMotion } from '@/hooks';
import { SERVICES_DATA } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Service } from '@/types';
import {
  Home,
  Building2,
  MessageCircle,
  Layout,
  ArrowRight,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================
// Animation Configuration
// ============================================

const SERVICES_ANIMATION = {
  card: {
    duration: 0.9,
    stagger: 0.12,
    ease: 'expo.out',
  },
  hover: {
    duration: 0.5,
    ease: 'power3.out',
  },
  icon: {
    duration: 0.6,
    ease: 'back.out(1.7)',
  },
};

// ============================================
// Icon Mapping
// ============================================

const iconMap: Record<string, LucideIcon> = {
  home: Home,
  building: Building2,
  'message-circle': MessageCircle,
  layout: Layout,
};

// ============================================
// Types
// ============================================

interface ServicesSectionProps {
  services?: Service[];
  variant?: 'grid' | 'list' | 'featured';
}

// ============================================
// Services Section Component
// ============================================

export const ServicesSection = ({
  services = SERVICES_DATA,
  variant = 'grid',
}: ServicesSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const headerLineRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // ============================================
  // Card Entrance Animation
  // ============================================

  useEffect(() => {
    if (prefersReducedMotion) return;

    const cards = cardsRef.current;
    const headerLine = headerLineRef.current;
    if (!cards) return;

    const ctx = gsap.context(() => {
      const items = cards.querySelectorAll('.service-card');

      // Staggered card entrance
      gsap.from(items, {
        y: 100,
        opacity: 0,
        rotateX: -15,
        stagger: SERVICES_ANIMATION.card.stagger,
        duration: SERVICES_ANIMATION.card.duration,
        ease: SERVICES_ANIMATION.card.ease,
        scrollTrigger: {
          trigger: cards,
          start: 'top 85%',
          once: true,
        },
      });

      // Animate header decorative line
      if (headerLine) {
        gsap.fromTo(
          headerLine,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: headerLine,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} className="relative bg-white py-24 md:py-32">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 top-1/3 h-96 w-96 rounded-full bg-gold/[0.03]" />
        <div className="absolute -right-48 bottom-1/4 h-64 w-64 rounded-full bg-neutral-100/80" />
      </div>

      <div className="container relative mx-auto px-6">
        {/* ============================================ */}
        {/* Section Header */}
        {/* ============================================ */}
        <div className="mb-20 text-center">
          <Reveal direction="up" distance={30}>
            <p className="mb-5 font-sans text-xs uppercase tracking-[0.4em] text-gold">
              What We Do
            </p>
          </Reveal>

          <Reveal delay={0.1} direction="up" distance={40}>
            <h2 className="mb-6 font-display text-4xl font-light text-black md:text-5xl lg:text-6xl">
              Our Services
            </h2>
          </Reveal>

          <Reveal delay={0.2} direction="up" distance={30} blur>
            <p className="mx-auto max-w-2xl font-sans text-lg text-neutral-500">
              From concept to completion, we offer comprehensive interior design
              services tailored to your unique needs and vision.
            </p>
          </Reveal>

          {/* Decorative Line */}
          <div className="mt-10 flex justify-center">
            <div
              ref={headerLineRef}
              className="h-px w-24 bg-gold/40"
              style={{ transformOrigin: 'center' }}
            />
          </div>
        </div>

        {/* ============================================ */}
        {/* Services Grid */}
        {/* ============================================ */}
        <div
          ref={cardsRef}
          className={cn(
            'grid gap-6',
            variant === 'list'
              ? 'md:grid-cols-1 lg:grid-cols-2'
              : 'md:grid-cols-2 lg:grid-cols-4'
          )}
          style={{ perspective: '1200px' }}
        >
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              variant={variant}
            />
          ))}
        </div>

        {/* ============================================ */}
        {/* CTA */}
        {/* ============================================ */}
        <Reveal delay={0.5} className="mt-20 text-center">
          <p className="mb-8 font-sans text-lg text-neutral-500">
            Ready to transform your space? Let&apos;s discuss your project.
          </p>
          <Magnetic strength={0.12}>
            <Link href="/contact">
              <Button variant="gold" size="lg" className="group">
                <span>Start Your Project</span>
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
    </section>
  );
};

// ============================================
// Service Card Component
// ============================================

interface ServiceCardProps {
  service: Service;
  index: number;
  variant?: 'grid' | 'list' | 'featured';
}

const ServiceCard = ({ service, index, variant = 'grid' }: ServiceCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const Icon = iconMap[service.icon] || Home;

  // ============================================
  // GSAP Hover Animation
  // ============================================

  useEffect(() => {
    if (prefersReducedMotion) return;

    const card = cardRef.current;
    const icon = iconRef.current;
    const line = lineRef.current;
    if (!card || !icon) return;

    if (isHovered) {
      // Icon animation
      gsap.to(icon, {
        scale: 1.1,
        rotation: 5,
        duration: SERVICES_ANIMATION.icon.duration,
        ease: SERVICES_ANIMATION.icon.ease,
      });

      // Line expansion
      if (line) {
        gsap.to(line, {
          width: '100%',
          duration: SERVICES_ANIMATION.hover.duration,
          ease: SERVICES_ANIMATION.hover.ease,
        });
      }
    } else {
      // Reset icon
      gsap.to(icon, {
        scale: 1,
        rotation: 0,
        duration: SERVICES_ANIMATION.hover.duration,
        ease: SERVICES_ANIMATION.hover.ease,
      });

      // Reset line
      if (line) {
        gsap.to(line, {
          width: '30%',
          duration: SERVICES_ANIMATION.hover.duration,
          ease: SERVICES_ANIMATION.hover.ease,
        });
      }
    }
  }, [isHovered, prefersReducedMotion]);

  return (
    <motion.div
      ref={cardRef}
      className="service-card group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={prefersReducedMotion ? {} : { y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={cn(
          'relative h-full overflow-hidden p-8 transition-colors duration-500',
          'bg-cream group-hover:bg-black',
          variant === 'list' && 'md:flex md:items-center md:gap-8 md:p-10'
        )}
      >
        {/* Number Index */}
        <span className="absolute right-6 top-6 font-display text-6xl font-light text-black/5 transition-colors duration-500 group-hover:text-white/5">
          0{index + 1}
        </span>

        {/* Icon */}
        <div className={cn('mb-8', variant === 'list' && 'md:mb-0')}>
          <div
            ref={iconRef}
            className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 transition-colors duration-500 group-hover:border-gold/50 group-hover:bg-gold/10"
          >
            <Icon
              size={28}
              className="text-gold"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Content */}
        <div className={cn('flex-1', variant === 'list' && 'md:pr-16')}>
          <h3 className="mb-4 font-display text-xl text-black transition-colors duration-500 group-hover:text-white md:text-2xl">
            {service.title}
          </h3>

          <p className="mb-6 font-sans text-sm leading-relaxed text-neutral-600 transition-colors duration-500 group-hover:text-neutral-400">
            {service.description}
          </p>

          {/* Link */}
          <Link
            href={`/services#${service.slug}`}
            className="group/link inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-gold transition-colors hover:text-gold/80"
            aria-label={`Learn more about ${service.title}`}
          >
            <span>Learn More</span>
            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Bottom Accent Line */}
        <div
          ref={lineRef}
          className="absolute bottom-0 left-0 h-0.5 w-[30%] bg-gold"
          style={{ transformOrigin: 'left' }}
        />

        {/* Hover Glow Effect */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-gold/10 blur-2xl" />
        </div>
      </div>
    </motion.div>
  );
};

export default ServicesSection;
