'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui';
import { Reveal } from '@/components/animations';
import { useReducedMotion } from '@/hooks';
import { SERVICES_DATA } from '@/lib/constants';
import type { Service } from '@/types';
import { Home, Building2, MessageCircle, Layout, ArrowRight } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ServicesSectionProps {
  services?: Service[];
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  home: Home,
  building: Building2,
  'message-circle': MessageCircle,
  layout: Layout,
};

export const ServicesSection = ({ services = SERVICES_DATA }: ServicesSectionProps) => {
  const cardsRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const cards = cardsRef.current;
    if (!cards) return;

    const items = cards.querySelectorAll('.service-card');

    gsap.from(items, {
      y: 80,
      opacity: 0,
      stagger: 0.15,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: cards,
        start: 'top bottom-=20%',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [prefersReducedMotion]);

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <Reveal className="mb-16 text-center">
          <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-gold">
            What We Do
          </p>
          <h2 className="mb-6 font-display text-4xl font-light text-black md:text-5xl">
            Our Services
          </h2>
          <p className="mx-auto max-w-2xl font-sans text-neutral-600">
            From concept to completion, we offer comprehensive interior design
            services tailored to your unique needs and vision.
          </p>
        </Reveal>

        {/* Services Grid */}
        <div
          ref={cardsRef}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* CTA */}
        <Reveal delay={0.4} className="mt-16 text-center">
          <p className="mb-6 font-sans text-neutral-600">
            Ready to transform your space? Let&apos;s discuss your project.
          </p>
          <Link href="/contact">
            <Button variant="gold">Start Your Project</Button>
          </Link>
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
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const Icon = iconMap[service.icon] || Home;

  return (
    <div className="service-card group relative bg-cream p-8 transition-all duration-500 hover:bg-black">
      {/* Icon */}
      <div className="mb-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 transition-colors duration-500 group-hover:border-gold/50">
          <Icon
            size={24}
            className="text-gold transition-transform duration-500 group-hover:scale-110"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Content */}
      <h3 className="mb-4 font-display text-xl text-black transition-colors duration-500 group-hover:text-white md:text-2xl">
        {service.title}
      </h3>
      <p className="mb-6 font-sans text-sm leading-relaxed text-neutral-600 transition-colors duration-500 group-hover:text-neutral-400">
        {service.description}
      </p>

      {/* Link */}
      <Link
        href={`/services#${service.slug}`}
        className="group/link inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-gold"
        aria-label={`Learn more about ${service.title}`}
        tabIndex={0}
      >
        Learn More
        <ArrowRight
          size={14}
          className="transition-transform duration-300 group-hover/link:translate-x-1"
          aria-hidden="true"
        />
      </Link>

      {/* Decorative Line */}
      <div className="absolute bottom-0 left-8 right-8 h-px bg-gold/20 transition-colors duration-500 group-hover:bg-gold/40" />
    </div>
  );
};

export default ServicesSection;
