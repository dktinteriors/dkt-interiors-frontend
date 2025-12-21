// ============================================
// Application Constants
// ============================================

export const SITE_CONFIG = {
  name: 'DKT Interiors',
  description: 'Creating sophisticated, modern interiors that reflect your unique style.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://dktinteriorsco.com',
  locale: 'en_US',
} as const;

export const API_CONFIG = {
  baseUrl: process.env.WORDPRESS_API_URL || 'https://dktinteriorsco.com',
  revalidate: Number(process.env.REVALIDATE_TIME) || 60,
  endpoints: {
    homepage: '/wp-json/dkt/v1/homepage',
    settings: '/wp-json/dkt/v1/settings',
    portfolio: '/wp-json/wp/v2/portfolio',
    posts: '/wp-json/wp/v2/posts',
    contact: '/wp-json/dkt/v1/contact',
    featuredPortfolio: '/wp-json/dkt/v1/featured-portfolio',
    services: '/wp-json/dkt/v1/services',
    testimonials: '/wp-json/dkt/v1/testimonials',
    menus: '/wp-json/dkt/v1/menus',
  },
} as const;

export const ANIMATION_CONFIG = {
  duration: {
    fast: 0.3,
    normal: 0.6,
    slow: 1.0,
  },
  ease: {
    smooth: [0.22, 1, 0.36, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
    power3: 'power3.out',
  },
  stagger: 0.1,
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const COLORS = {
  gold: '#d4af37',
  goldLight: '#e6c967',
  goldDark: '#b8941f',
  black: '#000000',
  white: '#ffffff',
  cream: '#fafafa',
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
} as const;

export const FONTS = {
  display: 'var(--font-display)',
  sans: 'var(--font-sans)',
} as const;

export const PROJECT_TYPES = [
  'Residential Design',
  'Commercial Design',
  'Design Consultation',
  'Space Planning',
  'Full Service Interior Design',
  'Other',
] as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Contact', href: '/contact' },
] as const;

export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/dktinteriors',
  pinterest: 'https://pinterest.com/dktinteriors',
} as const;

export const CONTACT_INFO = {
  phone: '732-882-3249',
  email: 'info@dktinteriorsco.com',
  address: 'Flower Mound, TX',
} as const;

export const SEO_DEFAULTS = {
  titleTemplate: '%s | DKT Interiors',
  defaultTitle: 'DKT Interiors | Sophisticated Modern Interior Design',
  description: 'Creating sophisticated, modern interiors in the Dallas-Fort Worth area. Full-service interior design for residential and commercial spaces.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'DKT Interiors',
  },
} as const;

export const STATS = [
  { number: '150+', label: 'Projects Completed' },
  { number: '12', label: 'Years Experience' },
  { number: '98%', label: 'Client Satisfaction' },
  { number: '25+', label: 'Design Awards' },
] as const;

export const SERVICES_DATA: { id: number; title: string; description: string; icon: string; slug: string }[] = [
  {
    id: 1,
    title: 'Residential Design',
    description: 'Complete home transformations that reflect your lifestyle and aesthetic preferences.',
    icon: 'home',
    slug: 'residential-design',
  },
  {
    id: 2,
    title: 'Commercial Design',
    description: 'Professional spaces that enhance productivity and create lasting impressions.',
    icon: 'building',
    slug: 'commercial-design',
  },
  {
    id: 3,
    title: 'Design Consultation',
    description: 'Expert guidance and direction for your design projects, big or small.',
    icon: 'message-circle',
    slug: 'design-consultation',
  },
  {
    id: 4,
    title: 'Space Planning',
    description: 'Optimized layouts that maximize functionality and flow in every room.',
    icon: 'layout',
    slug: 'space-planning',
  },
];

export const TESTIMONIALS_DATA = [
  {
    id: 1,
    content: 'DKT Interiors transformed our home into something beyond our wildest dreams. Their attention to detail and understanding of our vision was exceptional.',
    author: 'Sarah M.',
    location: 'Flower Mound, TX',
    project: 'Whole Home Renovation',
  },
  {
    id: 2,
    content: 'Working with DKT was an absolute pleasure. They managed every detail seamlessly and delivered a space that perfectly reflects our family\'s lifestyle.',
    author: 'Michael & Jennifer T.',
    location: 'Highland Village, TX',
    project: 'Kitchen & Living Room',
  },
  {
    id: 3,
    content: 'The team at DKT brought a level of sophistication and warmth to our office that has truly elevated our business environment.',
    author: 'David R.',
    location: 'Lewisville, TX',
    project: 'Commercial Office Design',
  },
];
