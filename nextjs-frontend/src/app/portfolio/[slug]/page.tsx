import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Reveal, ImageReveal, StaggerReveal } from '@/components/animations';
import { portfolio } from '@/lib/api';
import type { PortfolioItem } from '@/types';
import { ArrowLeft, Facebook, Twitter, MapPin } from 'lucide-react';

// ============================================
// Types
// ============================================

interface PageProps {
  params: { slug: string };
}

// ============================================
// Static Generation
// ============================================

export const generateStaticParams = async () => {
  const slugs = await portfolio.getAllSlugs().catch(() => []);
  return slugs.map((slug) => ({ slug }));
};

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const item = await portfolio.getBySlug(params.slug);

  if (!item) {
    return { title: 'Project Not Found' };
  }

  const imageUrl =
    item.featured_image_urls?.['og-image']?.url ||
    item.featured_image_urls?.large?.url ||
    '/images/og-image.jpg';

  return {
    title: item.title,
    description:
      item.excerpt ||
      `View our ${item.portfolio_meta.project_type || 'interior design'} project: ${item.title}`,
    openGraph: {
      title: `${item.title} | DKT Interiors`,
      description: item.excerpt || '',
      images: [imageUrl],
      type: 'article',
    },
  };
};

export const revalidate = 60;

// ============================================
// Portfolio Single Page
// ============================================

const PortfolioSinglePage = async ({ params }: PageProps) => {
  const item = await portfolio.getBySlug(params.slug);

  if (!item) {
    notFound();
  }

  const relatedItems = await portfolio.getRelated(item.id, 3).catch(() => []);

  const heroImage =
    item.featured_image_urls?.['hero-image']?.url ||
    item.featured_image_urls?.large?.url;

  return (
    <>
      {/* Hero Image */}
      {heroImage && (
        <section className="relative h-[70vh] overflow-hidden md:h-[80vh]">
          <ImageReveal direction="up" className="absolute inset-0">
            <Image
              src={heroImage}
              alt={item.featured_image_urls?.alt || item.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </ImageReveal>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Title */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
            <div className="container mx-auto">
              <Reveal>
                <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-gold">
                  {item.portfolio_meta.project_type || 'Interior Design'}
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="mb-4 font-display text-4xl font-light text-white md:text-5xl lg:text-6xl">
                  {item.title}
                </h1>
              </Reveal>
              {item.portfolio_meta.location && (
                <Reveal delay={0.2}>
                  <p className="flex items-center gap-2 font-sans text-lg text-white/80">
                    <MapPin size={18} aria-hidden="true" />
                    {item.portfolio_meta.location}
                  </p>
                </Reveal>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="bg-white py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {!heroImage && (
                <>
                  <Reveal>
                    <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-gold">
                      {item.portfolio_meta.project_type || 'Interior Design'}
                    </p>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <h1 className="mb-8 font-display text-4xl font-light text-black md:text-5xl">
                      {item.title}
                    </h1>
                  </Reveal>
                </>
              )}

              {item.excerpt && (
                <Reveal delay={0.2}>
                  <div
                    className="mb-8 font-display text-xl leading-relaxed text-neutral-700 md:text-2xl"
                    dangerouslySetInnerHTML={{ __html: item.excerpt }}
                  />
                </Reveal>
              )}

              <Reveal delay={0.3}>
                <div
                  className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-light prose-p:font-sans prose-p:text-neutral-600"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              </Reveal>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ProjectDetails item={item} />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {item.gallery_images && item.gallery_images.length > 0 && (
        <section className="bg-cream py-20 md:py-28">
          <div className="container mx-auto px-6">
            <Reveal className="mb-12 text-center">
              <h2 className="font-display text-3xl font-light text-black md:text-4xl">
                Project Gallery
              </h2>
            </Reveal>

            <StaggerReveal className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {item.gallery_images.map((image) => (
                <div
                  key={image.id}
                  className="group relative aspect-[4/3] overflow-hidden bg-neutral-100"
                >
                  <Image
                    src={image.urls['portfolio-large'] || image.urls.large}
                    alt={image.alt || `Gallery image`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ))}
            </StaggerReveal>
          </div>
        </section>
      )}

      {/* Navigation */}
      <section className="border-t border-neutral-200 bg-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 font-sans text-sm uppercase tracking-widest text-neutral-600 transition-colors hover:text-gold"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              All Projects
            </Link>

            <Link href="/contact">
              <Button variant="gold">Start Your Project</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedItems.length > 0 && (
        <section className="bg-cream py-20 md:py-28">
          <div className="container mx-auto px-6">
            <Reveal className="mb-12 text-center">
              <h2 className="font-display text-3xl font-light text-black md:text-4xl">
                Related Projects
              </h2>
            </Reveal>

            <StaggerReveal className="grid gap-6 md:grid-cols-3">
              {relatedItems.map((related) => (
                <RelatedProjectCard key={related.id} item={related} />
              ))}
            </StaggerReveal>
          </div>
        </section>
      )}
    </>
  );
};

// ============================================
// Project Details Sidebar Component
// ============================================

interface ProjectDetailsProps {
  item: PortfolioItem;
}

const ProjectDetails = ({ item }: ProjectDetailsProps) => {
  const details = [
    { label: 'Client', value: item.portfolio_meta.client },
    { label: 'Year', value: item.portfolio_meta.year },
    { label: 'Location', value: item.portfolio_meta.location },
    { label: 'Project Type', value: item.portfolio_meta.project_type },
    { label: 'Size', value: item.portfolio_meta.square_footage },
    { label: 'Duration', value: item.portfolio_meta.duration },
  ].filter((detail) => detail.value);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <Reveal className="sticky top-32 rounded bg-cream p-8">
      <h3 className="mb-6 font-display text-xl text-black">Project Details</h3>

      <div className="space-y-6">
        {details.map((detail) => (
          <div key={detail.label}>
            <p className="mb-1 font-sans text-xs uppercase tracking-widest text-neutral-400">
              {detail.label}
            </p>
            <p className="font-sans text-black">{detail.value}</p>
          </div>
        ))}

        {/* Categories */}
        {item.portfolio_categories.length > 0 && (
          <div>
            <p className="mb-2 font-sans text-xs uppercase tracking-widest text-neutral-400">
              Category
            </p>
            <div className="flex flex-wrap gap-2">
              {item.portfolio_categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/portfolio?category=${category.slug}`}
                  className="bg-white px-3 py-1 font-sans text-xs uppercase tracking-wide text-neutral-600 transition-colors hover:bg-gold hover:text-black"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-neutral-200" />

        {/* Share */}
        <div>
          <p className="mb-3 font-sans text-xs uppercase tracking-widest text-neutral-400">
            Share
          </p>
          <div className="flex gap-2">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded bg-white text-neutral-600 transition-all hover:bg-[#1877f2] hover:text-white"
              aria-label="Share on Facebook"
            >
              <Facebook size={16} aria-hidden="true" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(item.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded bg-white text-neutral-600 transition-all hover:bg-black hover:text-white"
              aria-label="Share on Twitter"
            >
              <Twitter size={16} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* CTA */}
        <Link href="/contact" className="block">
          <Button variant="primary" className="w-full">
            Start Your Project
          </Button>
        </Link>
      </div>
    </Reveal>
  );
};

// ============================================
// Related Project Card Component
// ============================================

interface RelatedProjectCardProps {
  item: PortfolioItem;
}

const RelatedProjectCard = ({ item }: RelatedProjectCardProps) => {
  const imageUrl =
    item.featured_image_urls?.['portfolio-thumb']?.url ||
    item.featured_image_urls?.medium?.url ||
    '/images/placeholder.jpg';

  return (
    <Link href={`/portfolio/${item.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
        <Image
          src={imageUrl}
          alt={item.featured_image_urls?.alt || item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="mt-4">
        <h3 className="font-display text-lg text-black transition-colors group-hover:text-gold">
          {item.title}
        </h3>
        {item.portfolio_meta.project_type && (
          <p className="mt-1 font-sans text-sm text-neutral-500">
            {item.portfolio_meta.project_type}
          </p>
        )}
      </div>
    </Link>
  );
};

export default PortfolioSinglePage;
