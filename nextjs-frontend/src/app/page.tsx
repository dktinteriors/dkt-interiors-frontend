import { Suspense } from 'react';
import {
  HeroSection,
  MarqueeSection,
  PortfolioSection,
  AboutSection,
  ServicesSection,
  TestimonialsSection,
  ContactSection,
} from '@/components/sections';
import { portfolio, getServices, getTestimonials, getSiteSettings } from '@/lib/api';
import { SERVICES_DATA, TESTIMONIALS_DATA } from '@/lib/constants';

// ISR - Revalidate every 60 seconds
export const revalidate = 60;

// ============================================
// Loading Fallbacks
// ============================================

const SectionSkeleton = () => (
  <div className="flex min-h-[400px] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
  </div>
);

// ============================================
// Homepage Component
// ============================================

const HomePage = async () => {
  // Fetch data with fallbacks
  const [portfolioItems, services, testimonials, settings] = await Promise.all([
    portfolio.getFeatured(6).catch(() => []),
    getServices().catch(() => SERVICES_DATA),
    getTestimonials().catch(() => TESTIMONIALS_DATA),
    getSiteSettings().catch(() => null),
  ]);

  const heroTitle = settings?.hero?.title || 'Where less becomes MORE';
  const heroSubtitle =
    settings?.hero?.subtitle ||
    'Creating sophisticated, modern interiors that reflect your unique style and enhance your daily life through thoughtful design and careful curation.';

  return (
    <>
      {/* Hero Section */}
      <HeroSection title={heroTitle} subtitle={heroSubtitle} />

      {/* Marquee Section */}
      <MarqueeSection />

      {/* Portfolio Section */}
      <Suspense fallback={<SectionSkeleton />}>
        <PortfolioSection items={portfolioItems} limit={6} showViewAll />
      </Suspense>

      {/* About Section */}
      <AboutSection />

      {/* Services Section */}
      <Suspense fallback={<SectionSkeleton />}>
        <ServicesSection services={services} />
      </Suspense>

      {/* Testimonials Section */}
      <Suspense fallback={<SectionSkeleton />}>
        <TestimonialsSection testimonials={testimonials} />
      </Suspense>

      {/* Contact Section */}
      <ContactSection />
    </>
  );
};

export default HomePage;
