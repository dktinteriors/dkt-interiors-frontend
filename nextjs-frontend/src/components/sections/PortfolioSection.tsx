'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui';
import { Reveal } from '@/components/animations';
import { cn } from '@/lib/utils';
import type { PortfolioItem, PortfolioCategory } from '@/types';
import { ArrowUpRight } from 'lucide-react';

interface PortfolioSectionProps {
  items: PortfolioItem[];
  categories?: PortfolioCategory[];
  showFilters?: boolean;
  showViewAll?: boolean;
  limit?: number;
}

export const PortfolioSection = ({
  items,
  categories = [],
  showFilters = false,
  showViewAll = true,
  limit,
}: PortfolioSectionProps) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const displayItems = useMemo(() => {
    let filtered = items;

    if (activeFilter !== 'all') {
      filtered = items.filter((item) =>
        item.portfolio_categories.some((cat) => cat.slug === activeFilter)
      );
    }

    return limit ? filtered.slice(0, limit) : filtered;
  }, [items, activeFilter, limit]);

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
    <section id="portfolio" className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <Reveal className="mb-16 text-center">
          <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-gold">
            Our Work
          </p>
          <h2 className="mb-6 font-display text-4xl font-light text-black md:text-5xl">
            Featured Projects
          </h2>
          <p className="mx-auto max-w-2xl font-sans text-neutral-600">
            A selection of our recent interior design projects showcasing our
            approach to modern, sophisticated living.
          </p>
        </Reveal>

        {/* Filters */}
        {showFilters && categories.length > 0 && (
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => handleFilterClick('all')}
              onKeyDown={(e) => handleFilterKeyDown(e, 'all')}
              className={cn(
                'px-6 py-2.5 font-sans text-sm uppercase tracking-widest transition-all',
                activeFilter === 'all'
                  ? 'bg-black text-white'
                  : 'border border-neutral-300 text-neutral-600 hover:border-black hover:text-black'
              )}
              aria-pressed={activeFilter === 'all'}
              tabIndex={0}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleFilterClick(category.slug)}
                onKeyDown={(e) => handleFilterKeyDown(e, category.slug)}
                className={cn(
                  'px-6 py-2.5 font-sans text-sm uppercase tracking-widest transition-all',
                  activeFilter === category.slug
                    ? 'bg-black text-white'
                    : 'border border-neutral-300 text-neutral-600 hover:border-black hover:text-black'
                )}
                aria-pressed={activeFilter === category.slug}
                tabIndex={0}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        {/* Portfolio Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {displayItems.map((item, index) => (
              <PortfolioCard key={item.id} item={item} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* View All Button */}
        {showViewAll && (
          <Reveal delay={0.3} className="mt-16 text-center">
            <Link href="/portfolio">
              <Button variant="outline" size="lg">
                View All Projects
              </Button>
            </Link>
          </Reveal>
        )}

        {/* No Results */}
        {displayItems.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-sans text-neutral-500">
              No projects found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

// ============================================
// Portfolio Card Component
// ============================================

interface PortfolioCardProps {
  item: PortfolioItem;
  index: number;
}

const PortfolioCard = ({ item, index }: PortfolioCardProps) => {
  const imageUrl =
    item.featured_image_urls?.['portfolio-large']?.url ||
    item.featured_image_urls?.large?.url ||
    '/images/placeholder.jpg';

  const imageAlt = item.featured_image_urls?.alt || item.title;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        href={`/portfolio/${item.slug}`}
        className="group block"
        aria-label={`View ${item.title} project`}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 transition-all duration-500 group-hover:opacity-100">
            <p className="mb-2 font-sans text-xs uppercase tracking-widest text-gold">
              {item.portfolio_meta.project_type || 'Interior Design'}
            </p>
            <h3 className="mb-2 font-display text-2xl font-light text-white md:text-3xl">
              {item.title}
            </h3>
            {item.portfolio_meta.location && (
              <p className="font-sans text-sm text-neutral-300">
                {item.portfolio_meta.location}
              </p>
            )}
          </div>

          {/* Arrow Icon */}
          <div className="absolute right-4 top-4 flex h-10 w-10 translate-x-4 items-center justify-center rounded-full bg-white/10 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
            <ArrowUpRight size={18} className="text-white" aria-hidden="true" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default PortfolioSection;
