'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui';
import { Reveal, ImageReveal, Parallax } from '@/components/animations';
import { useReducedMotion } from '@/hooks';
import { STATS } from '@/lib/constants';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const AboutSection = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const stats = statsRef.current;
    if (!stats) return;

    const items = stats.querySelectorAll('.stat-item');

    gsap.from(items, {
      y: 60,
      opacity: 0,
      stagger: 0.15,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: items[0],
        start: 'top bottom-=20%',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [prefersReducedMotion]);

  return (
    <section className="overflow-hidden bg-cream py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Image Column */}
          <div className="relative order-2 lg:order-1">
            <ImageReveal direction="left" className="relative z-10">
              <div className="relative aspect-[4/5]">
                <Image
                  src="/images/about-studio.jpg"
                  alt="DKT Interiors Studio"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </ImageReveal>

            {/* Decorative Elements */}
            <Reveal delay={0.5}>
              <div className="absolute -bottom-6 -right-6 -z-10 h-48 w-48 border border-gold/30" />
            </Reveal>
            <Parallax speed={0.3} className="absolute -left-10 -top-10 z-20">
              <div className="flex h-32 w-32 items-center justify-center bg-gold/10 backdrop-blur-sm">
                <div className="text-center">
                  <span className="font-display text-4xl text-gold">12</span>
                  <span className="ml-1 mt-auto block font-sans text-xs uppercase tracking-widest text-neutral-600">
                    Years
                  </span>
                </div>
              </div>
            </Parallax>
          </div>

          {/* Text Column */}
          <div className="order-1 lg:order-2">
            <Reveal>
              <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-gold">
                About Us
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="mb-6 font-display text-4xl font-light text-black md:text-5xl">
                Designing Spaces That{' '}
                <span className="italic text-gold">Inspire</span>
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mb-6 font-sans leading-relaxed text-neutral-600">
                At DKT Interiors, we believe exceptional design emerges from
                understanding not just what you love, but how you live. Our
                thorough discovery process ensures we create spaces that truly
                reflect your personality while maintaining the sophisticated
                aesthetic that defines our work.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="mb-8 font-sans leading-relaxed text-neutral-600">
                Based in Flower Mound, Texas, we bring a fresh perspective to
                interior design, combining timeless elegance with contemporary
                functionality. Every project begins with listening, continues
                with careful curation, and culminates in spaces that feel
                uniquely yours.
              </p>
            </Reveal>

            {/* Values Grid */}
            <Reveal delay={0.4}>
              <div className="mb-8 grid grid-cols-2 gap-6">
                <div>
                  <h4 className="mb-2 font-display text-lg text-black">
                    Our Philosophy
                  </h4>
                  <p className="font-sans text-sm text-neutral-500">
                    Less is more. We focus on quality over quantity, creating
                    curated spaces with intention.
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-display text-lg text-black">
                    Our Process
                  </h4>
                  <p className="font-sans text-sm text-neutral-500">
                    Collaborative and transparent, we guide you through every
                    step of the design journey.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.5}>
              <Link href="/about">
                <Button variant="primary">Learn More About Us</Button>
              </Link>
            </Reveal>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 border-t border-neutral-200 pt-16" ref={statsRef}>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="stat-item text-center">
                <span className="mb-2 block font-display text-4xl text-gold md:text-5xl">
                  {stat.number}
                </span>
                <span className="font-sans text-sm uppercase tracking-widest text-neutral-500">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
