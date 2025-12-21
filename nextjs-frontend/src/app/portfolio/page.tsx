import type { Metadata } from 'next';
import { PageHero } from '@/components/layout';
import { PortfolioSection } from '@/components/sections';
import { portfolio } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Explore our collection of interior design projects showcasing residential and commercial spaces across the Dallas-Fort Worth area.',
};

export const revalidate = 60;

const PortfolioPage = async () => {
  const [items, categories] = await Promise.all([
    portfolio.getAll({ per_page: 20 }).catch(() => []),
    portfolio.getCategories().catch(() => []),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title="Portfolio"
        description="A curated collection of our interior design projects, showcasing our commitment to creating beautiful, functional spaces that reflect our clients' unique styles."
      />

      <PortfolioSection
        items={items}
        categories={categories}
        showFilters
        showViewAll={false}
      />
    </>
  );
};

export default PortfolioPage;
