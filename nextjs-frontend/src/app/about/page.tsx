import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PageHero } from '@/components/layout';
import { Button } from '@/components/ui';
import { Reveal, ImageReveal, StaggerReveal } from '@/components/animations';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about DKT Interiors, a full-service interior design firm based in Flower Mound, Texas. Discover our story, philosophy, and approach to creating beautiful spaces.',
};

// ============================================
// Data
// ============================================

const VALUES = [
  {
    title: 'Quality Over Quantity',
    description:
      'We believe in curating spaces with intention, selecting each element for its beauty and purpose.',
  },
  {
    title: 'Client Collaboration',
    description:
      'Your vision is our guide. We listen carefully and translate your dreams into tangible designs.',
  },
  {
    title: 'Timeless Design',
    description:
      'We create spaces that transcend trends, remaining beautiful and functional for years to come.',
  },
  {
    title: 'Attention to Detail',
    description:
      'From the overall concept to the smallest finishing touch, every detail matters to us.',
  },
];

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Discovery',
    description:
      'We begin with an in-depth consultation to understand your lifestyle, preferences, and project goals.',
  },
  {
    number: '02',
    title: 'Concept Development',
    description:
      'Our team creates a comprehensive design concept, including mood boards, space planning, and material selections.',
  },
  {
    number: '03',
    title: 'Design Refinement',
    description:
      'We refine every detail together, ensuring the design perfectly reflects your vision and practical needs.',
  },
  {
    number: '04',
    title: 'Implementation',
    description:
      'We manage all aspects of project execution, coordinating with contractors and vendors to bring your space to life.',
  },
];

// ============================================
// About Page Component
// ============================================

const AboutPage = () => {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Our Story"
        description="Creating spaces that inspire, comfort, and reflect the unique personalities of those who inhabit them."
      />

      {/* Story Section */}
      <section className="bg-white py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <ImageReveal direction="left">
              <div className="relative aspect-[4/5]">
                <Image
                  src="/images/about-founder.jpg"
                  alt="DKT Interiors Founder"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </ImageReveal>

            <div>
              <Reveal>
                <h2 className="mb-6 font-display text-4xl font-light text-black md:text-5xl">
                  Where Passion Meets{' '}
                  <span className="italic text-gold">Purpose</span>
                </h2>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="mb-6 font-sans leading-relaxed text-neutral-600">
                  Founded with a vision to transform how people experience their
                  spaces, DKT Interiors has grown from a passionate endeavor
                  into a full-service interior design firm serving the
                  Dallas-Fort Worth metroplex.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="mb-6 font-sans leading-relaxed text-neutral-600">
                  Our approach is rooted in the belief that exceptional design
                  emerges from understanding not just what you love, but how you
                  live. We take the time to learn about your lifestyle, your
                  dreams, and your daily rituals, translating these insights
                  into spaces that feel authentically yours.
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <p className="font-sans leading-relaxed text-neutral-600">
                  Based in Flower Mound, Texas, we bring a fresh perspective to
                  interior design, combining timeless elegance with contemporary
                  functionality. Every project is an opportunity to create
                  something extraordinary.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-cream py-20 md:py-28">
        <div className="container mx-auto px-6">
          <Reveal className="mb-16 text-center">
            <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-gold">
              Our Philosophy
            </p>
            <h2 className="font-display text-4xl font-light text-black md:text-5xl">
              What We Believe
            </h2>
          </Reveal>

          <StaggerReveal className="grid gap-8 md:grid-cols-2">
            {VALUES.map((value) => (
              <div key={value.title} className="bg-white p-8">
                <h3 className="mb-4 font-display text-xl text-black">
                  {value.title}
                </h3>
                <p className="font-sans leading-relaxed text-neutral-600">
                  {value.description}
                </p>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-black py-20 text-white md:py-28">
        <div className="container mx-auto px-6">
          <Reveal className="mb-16 text-center">
            <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-gold">
              How We Work
            </p>
            <h2 className="font-display text-4xl font-light text-white md:text-5xl">
              Our Process
            </h2>
          </Reveal>

          <StaggerReveal className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step) => (
              <div key={step.number} className="relative">
                <span className="absolute -left-2 -top-4 font-display text-6xl text-gold/20">
                  {step.number}
                </span>
                <div className="pt-8">
                  <h3 className="mb-4 font-display text-xl text-white">
                    {step.title}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-neutral-400">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-cream py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <h2 className="mb-6 font-display text-4xl font-light text-black md:text-5xl">
                Ready to Transform Your Space?
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mb-8 font-sans text-neutral-600">
                Let&apos;s discuss your project and explore how we can create
                something extraordinary together.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/contact">
                  <Button variant="primary" size="lg">
                    Start Your Project
                  </Button>
                </Link>
                <Link href="/portfolio">
                  <Button variant="outline" size="lg">
                    View Our Work
                  </Button>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
