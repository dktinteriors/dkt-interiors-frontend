import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import { Header, Footer } from '@/components/layout';
import { SmoothScroll, PageTransition } from '@/components/animations';
import { SITE_CONFIG, SEO_DEFAULTS, CONTACT_INFO } from '@/lib/constants';
import './globals.css';

// ============================================
// Font Configuration
// ============================================

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

// ============================================
// Metadata Configuration
// ============================================

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SEO_DEFAULTS.defaultTitle,
    template: SEO_DEFAULTS.titleTemplate,
  },
  description: SEO_DEFAULTS.description,
  keywords: [
    'interior design',
    'interior designer',
    'Flower Mound interior design',
    'Dallas interior design',
    'DFW interior designer',
    'Texas interior design',
    'residential design',
    'commercial design',
    'modern interiors',
    'luxury interior design',
    'DKT Interiors',
  ],
  authors: [{ name: 'DKT Interiors' }],
  creator: 'DKT Interiors',
  publisher: 'DKT Interiors',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: SEO_DEFAULTS.defaultTitle,
    description: SEO_DEFAULTS.description,
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DKT Interiors - Sophisticated Modern Interior Design',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO_DEFAULTS.defaultTitle,
    description: SEO_DEFAULTS.description,
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
};

// ============================================
// JSON-LD Structured Data
// ============================================

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'InteriorDesignBusiness',
  '@id': `${SITE_CONFIG.url}/#organization`,
  name: SITE_CONFIG.name,
  description: SEO_DEFAULTS.description,
  url: SITE_CONFIG.url,
  telephone: CONTACT_INFO.phone,
  email: CONTACT_INFO.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Flower Mound',
    addressRegion: 'TX',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 33.0146,
    longitude: -97.0969,
  },
  areaServed: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: 33.0146,
      longitude: -97.0969,
    },
    geoRadius: '50000',
  },
  priceRange: '$$$',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '17:00',
  },
  sameAs: [
    'https://instagram.com/dktinteriors',
    'https://pinterest.com/dktinteriors',
  ],
  image: `${SITE_CONFIG.url}/images/og-image.jpg`,
};

// ============================================
// Root Layout Component
// ============================================

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <SmoothScroll>
          <Header />
          <PageTransition>
            <main id="main" role="main">
              {children}
            </main>
          </PageTransition>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
};

export default RootLayout;
