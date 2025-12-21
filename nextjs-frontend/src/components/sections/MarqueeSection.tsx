'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from '@/hooks';

const MARQUEE_ITEMS = [
  'Residential Design',
  '•',
  'Commercial Spaces',
  '•',
  'Space Planning',
  '•',
  'Custom Millwork',
  '•',
  'Interior Styling',
  '•',
  'Project Management',
  '•',
];

export const MarqueeSection = () => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const marquee = marqueeRef.current;
    if (!marquee) return;

    const items = marquee.querySelectorAll('.marquee-item');
    const firstItem = items[0] as HTMLElement;
    if (!firstItem) return;

    const totalWidth = firstItem.offsetWidth * (items.length / 4);

    gsap.to(items, {
      x: -totalWidth,
      duration: 30,
      ease: 'none',
      repeat: -1,
    });

    return () => {
      gsap.killTweensOf(items);
    };
  }, [prefersReducedMotion]);

  // Duplicate items for seamless loop
  const allItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <section
      className="overflow-hidden bg-black py-8"
      aria-label="Services marquee"
    >
      <div ref={marqueeRef} className="flex whitespace-nowrap">
        {allItems.map((item, index) => (
          <span
            key={index}
            className={`marquee-item px-4 font-display text-lg md:text-xl ${
              item === '•' ? 'text-gold' : 'tracking-wide text-white/80'
            }`}
            aria-hidden={index >= MARQUEE_ITEMS.length}
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
};

export default MarqueeSection;
