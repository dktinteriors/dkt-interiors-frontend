// ============================================
// WordPress API Response Types
// ============================================

export interface WordPressImage {
  id: number;
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface FeaturedImageUrls {
  thumbnail?: WordPressImage;
  medium?: WordPressImage;
  large?: WordPressImage;
  full?: WordPressImage;
  'portfolio-thumb'?: WordPressImage;
  'portfolio-large'?: WordPressImage;
  'hero-image'?: WordPressImage;
  'og-image'?: WordPressImage;
  alt?: string;
}

export interface GalleryImage {
  id: number;
  alt: string;
  caption?: string;
  urls: {
    thumbnail: string;
    medium: string;
    large: string;
    full: string;
    'portfolio-large'?: string;
  };
}

// ============================================
// Portfolio Types
// ============================================

export interface PortfolioCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface PortfolioMeta {
  client?: string;
  year?: string;
  location?: string;
  project_type?: string;
  square_footage?: string;
  duration?: string;
  services?: string;
  featured?: boolean;
}

export interface PortfolioItem {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  featured_image_urls: FeaturedImageUrls;
  gallery_images: GalleryImage[];
  portfolio_meta: PortfolioMeta;
  portfolio_categories: PortfolioCategory[];
}

// ============================================
// Blog Types
// ============================================

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  author: {
    name: string;
    avatar?: string;
  };
  featured_image_urls: FeaturedImageUrls;
  categories: { id: number; name: string; slug: string }[];
  tags: { id: number; name: string; slug: string }[];
  reading_time?: number;
}

// ============================================
// Site Configuration Types
// ============================================

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

export interface SocialLinks {
  instagram?: string;
  pinterest?: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
}

export interface SiteSettings {
  name: string;
  description: string;
  contact: ContactInfo;
  social: SocialLinks;
  hero: {
    title: string;
    subtitle: string;
  };
}

// ============================================
// Service Types
// ============================================

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  slug: string;
}

// ============================================
// Testimonial Types
// ============================================

export interface Testimonial {
  id: number;
  content: string;
  author: string;
  location: string;
  project: string;
  rating?: number;
}

// ============================================
// Navigation Types
// ============================================

export interface MenuItem {
  id: number;
  title: string;
  url: string;
  target?: string;
  children?: MenuItem[];
}

export interface Menu {
  name: string;
  items: MenuItem[];
}

// ============================================
// Form Types
// ============================================

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  project_type?: string;
  message: string;
  website?: string; // honeypot
}

export interface FormResponse {
  success: boolean;
  message: string;
}

// ============================================
// API Response Types
// ============================================

export interface HomepageData {
  settings: SiteSettings;
  featured_portfolio: PortfolioItem[];
  services: Service[];
  testimonials: Testimonial[];
  menu: Menu;
}

export interface ApiError {
  code: string;
  message: string;
  status: number;
}

// ============================================
// Component Props Types
// ============================================

export interface AnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export interface SectionProps {
  className?: string;
  id?: string;
}

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'gold' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
