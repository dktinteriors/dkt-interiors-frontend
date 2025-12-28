'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui';
import { Reveal, Magnetic, ImageReveal } from '@/components/animations';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks';
import type { PortfolioItem, PortfolioCategory } from '@/types';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================
// Animation Configuration
// ============================================

const PORTFOLIO_ANIMATION = {
  // Card animations
  card: {
    duration: 0.7,
    stagger: 0.12,
    ease: [0.16, 1, 0.3, 1], // Custom smooth easing
  },
  // Filter animations
  filter: {
    duration: 0.4,
    ease: [0.22, 1, 0.36, 1],
  },
  // Hover effects
  hover: {
    imageDuration: 0.8,
    overlayDuration: 0.5,
    contentDuration: 0.4,
  },
};

// ============================================
// Types
// ============================================

interface PortfolioSectionProps {
  items: PortfolioItem[];
  categories?: PortfolioCategory[];
  showFilters?: boolean;
  showViewAll?: boolean;
  limit?: number;
  variant?: 'grid' | 'masonry' | 'featured';
}

// ============================================
// Portfolio Section Component
// ============================================

export const PortfolioSection = ({
  items,
  categories = [],
  showFilters = false,
  showViewAll = true,
  limit,
  variant = 'grid',
}: PortfolioSectionProps) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Filter items
  const displayItems = useMemo(() => {
    let filtered = items;

    if (activeFilter !== 'all') {
      filtered = items.filter((item) =>
        item.portfolio_categories?.some((cat) => cat.slug === activeFilter)
      );
    }

    return limit ? filtered.slice(0, limit) : filtered;
  }, [items, activeFilter, limit]);

  // Section header animation
  useEffect(() => {
    if (prefersReducedMotion) return;

    const header = headerRef.current;
    if (!header) return;

    const ctx = gsap.context(() => {
      // Animate the decorative line
      const line = header.querySelector('.header-line');
      if (line) {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: header,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }
    }, header);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Filter handlers
  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleFilterKeyDown = (event: React.KeyboardEvent, filter: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleFilterClick(filter);
    }
  };

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="relative bg-white py-24 md:py-32"
    >
      {/* Background Decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-gold/[0.02]" />
        <div className="absolute -left-32 bottom-1/4 h-64 w-64 rounded-full bg-neutral-100/50" />
      </div>

      <div className="container relative mx-auto px-6">
        {/* ============================================ */}
        {/* Section Header */}
        {/* ============================================ */}
        <div ref={headerRef} className="mb-20 text-center">
          <Reveal direction="up" distance={30}>
            <p className="mb-5 font-sans text-xs uppercase tracking-[0.4em] text-gold">
              Our Work
            </p>
          </Reveal>

          <Reveal delay={0.1} direction="up" distance={40}>
            <h2 className="mb-6 font-display text-4xl font-light text-black md:text-5xl lg:text-6xl">
              Featured Projects
            </h2>
          </Reveal>

          <Reveal delay={0.2} direction="up" distance={30} blur>
            <p className="mx-auto max-w-2xl font-sans text-lg text-neutral-500">
              A curated selection of our recent interior design projects,
              showcasing our approach to modern, sophisticated living.
            </p>
          </Reveal>

          {/* Decorative Line */}
          <div className="mt-10 flex justify-center">
            <div
              className="header-line h-px w-24 bg-gold/40"
              style={{ transformOrigin: 'center' }}
            />
          </div>
        </div>

        {/* ============================================ */}
        {/* Filters */}
        {/* ============================================ */}
        {showFilters && categories.length > 0 && (
          <Reveal delay={0.3} className="mb-14">
            <div className="flex flex-wrap justify-center gap-3">
              <FilterButton
                label="All"
                isActive={activeFilter === 'all'}
                onClick={() => handleFilterClick('all')}
                onKeyDown={(e) => handleFilterKeyDown(e, 'all')}
              />
              {categories.map((category) => (
                <FilterButton
                  key={category.id}
                  label={category.name}
                  isActive={activeFilter === category.slug}
                  onClick={() => handleFilterClick(category.slug)}
                  onKeyDown={(e) => handleFilterKeyDown(e, category.slug)}
                />
              ))}
            </div>
          </Reveal>
        )}

        {/* ============================================ */}
        {/* Portfolio Grid */}
        {/* ============================================ */}
        <div
          className={cn(
            'grid gap-8',
            variant === 'masonry'
              ? 'md:grid-cols-2 lg:grid-cols-3'
              : 'md:grid-cols-2 lg:grid-cols-3'
          )}
        >
          <AnimatePresence mode="popLayout">
            {displayItems.map((item, index) => (
              <PortfolioCard
                key={item.id}
                item={item}
                index={index}
                variant={variant}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* ============================================ */}
        {/* View All Button */}
        {/* ============================================ */}
        {showViewAll && (
          <Reveal delay={0.4} className="mt-20 text-center">
            <Magnetic strength={0.12}>
              <Link href="/portfolio">
                <Button variant="outline" size="lg" className="group">
                  <span>View All Projects</span>
                  <ArrowRight
                    size={18}
                    className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Button>
              </Link>
            </Magnetic>
          </Reveal>
        )}

        {/* ============================================ */}
        {/* No Results */}
        {/* ============================================ */}
        {displayItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 text-center"
          >
            <p className="font-sans text-neutral-400">
              No projects found in this category.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

// ============================================
// Filter Button Component
// ============================================

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const FilterButton = ({
  label,
  isActive,
  onClick,
  onKeyDown,
}: FilterButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={cn(
        'relative px-6 py-3 font-sans text-sm uppercase tracking-widest transition-colors duration-300',
        isActive
          ? 'text-white'
          : 'text-neutral-500 hover:text-black'
      )}
      aria-pressed={isActive}
      tabIndex={0}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background */}
      <motion.span
        className="absolute inset-0 bg-black"
        initial={false}
        animate={{
          opacity: isActive ? 1 : 0,
          scale: isActive ? 1 : 0.9,
        }}
        transition={{
          duration: PORTFOLIO_ANIMATION.filter.duration,
          ease: PORTFOLIO_ANIMATION.filter.ease,
        }}
      />
      {/* Border (visible when inactive) */}
      <span
        className={cn(
          'absolute inset-0 border transition-colors duration-300',
          isActive ? 'border-transparent' : 'border-neutral-200 hover:border-neutral-400'
        )}
      />
      {/* Label */}
      <span className="relative z-10">{label}</span>
    </motion.button>
  );
};

// ============================================
// Portfolio Card Component
// ============================================

interface PortfolioCardProps {
  item: PortfolioItem;
  index: number;
  variant?: 'grid' | 'masonry' | 'featured';
}

const PortfolioCard = ({ item, index, variant = 'grid' }: PortfolioCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const imageUrl =
    item.featured_image_urls?.['portfolio-large']?.url ||
    item.featured_image_urls?.large?.url ||
    '/images/placeholder.jpg';

  const imageAlt = item.featured_image_urls?.alt || item.title;

  // Determine aspect ratio based on index for masonry effect
  const aspectRatio = useMemo(() => {
    if (variant === 'masonry') {
      // Alternate between tall and standard aspect ratios
      return index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/5]';
    }
    return 'aspect-[4/5]';
  }, [variant, index]);

  // GSAP hover animation for image
  useEffect(() => {
    if (prefersReducedMotion) return;

    const card = cardRef.current;
    const image = imageRef.current;
    if (!card || !image) return;

    const img = image.querySelector('img');
    if (!img) return;

    const handleMouseEnter = () => {
      gsap.to(img, {
        scale: 1.08,
        duration: PORTFOLIO_ANIMATION.hover.imageDuration,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(img, {
        scale: 1,
        duration: PORTFOLIO_ANIMATION.hover.imageDuration * 0.8,
        ease: 'power2.out',
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [prefersReducedMotion]);

  return (
    <motion.article
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: PORTFOLIO_ANIMATION.card.duration,
        delay: index * PORTFOLIO_ANIMATION.card.stagger,
        ease: PORTFOLIO_ANIMATION.card.ease,
      }}
      className="group"
    >
      <Link
        href={`/portfolio/${item.slug}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4"
        aria-label={`View ${item.title} project`}
      >
        <div className={cn('relative overflow-hidden bg-neutral-100', aspectRatio)}>
          {/* Image Container */}
          <div ref={imageRef} className="absolute inset-0">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Gradient Overlay */}
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent',
              'opacity-0 transition-opacity duration-500 group-hover:opacity-100'
            )}
          />

          {/* Content Overlay */}
          <div
            className={cn(
              'absolute inset-0 flex flex-col justify-end p-6 md:p-8',
              'translate-y-4 opacity-0 transition-all duration-500',
              'group-hover:translate-y-0 group-hover:opacity-100'
            )}
          >
            {/* Category Tag */}
            <p className="mb-3 font-sans text-xs uppercase tracking-widest text-gold">
              {item.portfolio_meta?.project_type || 'Interior Design'}
            </p>

            {/* Title */}
            <h3 className="mb-2 font-display text-2xl font-light text-white md:text-3xl">
              {item.title}
            </h3>

            {/* Location */}
            {item.portfolio_meta?.location && (
              <p className="font-sans text-sm text-white/70">
                {item.portfolio_meta.location}
              </p>
            )}
          </div>

          {/* Arrow Icon */}
          <div
            className={cn(
              'absolute right-5 top-5',
              'flex h-12 w-12 items-center justify-center rounded-full',
              'bg-white/10 backdrop-blur-sm',
              'translate-x-4 opacity-0 transition-all duration-500',
              'group-hover:translate-x-0 group-hover:opacity-100'
            )}
          >
            <ArrowUpRight
              size={20}
              className="text-white"
              aria-hidden="true"
            />
          </div>

          {/* Bottom Accent Line */}
          <div
            className={cn(
              'absolute bottom-0 left-0 h-1 bg-gold',
              'w-0 transition-all duration-700 ease-out',
              'group-hover:w-full'
            )}
          />
        </div>

        {/* Card Footer - visible on mobile/always */}
        <div className="mt-4 md:hidden">
          <p className="mb-1 font-sans text-xs uppercase tracking-widest text-gold">
            {item.portfolio_meta?.project_type || 'Interior Design'}
          </p>
          <h3 className="font-display text-xl font-light text-black">
            {item.title}
          </h3>
        </div>
      </Link>
    </motion.article>
  );
};

export default PortfolioSection;
