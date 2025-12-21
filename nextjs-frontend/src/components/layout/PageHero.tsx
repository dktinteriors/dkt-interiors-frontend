'use client';

import { Reveal } from '@/components/animations';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export const PageHero = ({
  eyebrow,
  title,
  description,
  className,
}: PageHeroProps) => {
  return (
    <section
      className={cn(
        'relative overflow-hidden bg-cream pb-20 pt-32 md:pb-28 md:pt-40',
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="max-w-3xl">
          {eyebrow && (
            <Reveal>
              <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-gold">
                {eyebrow}
              </p>
            </Reveal>
          )}

          <Reveal delay={0.1}>
            <h1 className="mb-6 font-display text-4xl font-light text-black md:text-5xl lg:text-6xl">
              {title}
            </h1>
          </Reveal>

          {description && (
            <Reveal delay={0.2}>
              <p className="font-sans text-lg leading-relaxed text-neutral-600">
                {description}
              </p>
            </Reveal>
          )}
        </div>
      </div>

      {/* Decorative Line */}
      <Reveal delay={0.3}>
        <div className="absolute bottom-0 left-0 h-px w-1/3 bg-gold/30" />
      </Reveal>
    </section>
  );
};

export default PageHero;
