import { API_CONFIG } from './constants';
import type {
  PortfolioItem,
  PortfolioCategory,
  BlogPost,
  SiteSettings,
  Service,
  Testimonial,
  Menu,
  HomepageData,
  ContactFormData,
  FormResponse,
  PortfolioMeta,
  GalleryImage,
} from '@/types';

// ============================================
// WordPress REST API Raw Types (before transformation)
// ============================================

interface WPRenderedField {
  rendered: string;
}

interface WPPortfolioRaw {
  id: number;
  slug: string;
  title: WPRenderedField;
  content: WPRenderedField;
  excerpt: WPRenderedField;
  date: string;
  modified: string;
  featured_image_urls?: Record<string, { url: string; width: number; height: number }> & { alt?: string };
  gallery_images?: GalleryImage[];
  portfolio_meta?: PortfolioMeta;
  portfolio_categories?: PortfolioCategory[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
      media_details?: {
        sizes?: Record<string, { source_url: string; width: number; height: number }>;
      };
    }>;
    'wp:term'?: Array<Array<{ id: number; name: string; slug: string }>>;
  };
}

// ============================================
// Data Transformation Functions
// ============================================

const transformPortfolioItem = (raw: WPPortfolioRaw): PortfolioItem => {
  // Extract featured image from _embedded or featured_image_urls
  let featured_image_urls: PortfolioItem['featured_image_urls'] = raw.featured_image_urls || {};
  
  if (raw._embedded?.['wp:featuredmedia']?.[0]) {
    const media = raw._embedded['wp:featuredmedia'][0];
    const sizes = media.media_details?.sizes || {};
    const altText = media.alt_text || '';
    
    const buildImageObj = (size: { source_url: string; width: number; height: number } | undefined): { id: number; url: string; alt: string; width: number; height: number } | undefined => {
      if (!size) return undefined;
      return { id: 0, url: size.source_url, alt: altText, width: size.width, height: size.height };
    };

    featured_image_urls = {
      alt: altText,
      full: { id: 0, url: media.source_url, alt: altText, width: 0, height: 0 },
      large: buildImageObj(sizes.large),
      medium: buildImageObj(sizes.medium),
      thumbnail: buildImageObj(sizes.thumbnail),
      'portfolio-large': buildImageObj(sizes['portfolio-large']),
      'portfolio-thumb': buildImageObj(sizes['portfolio-thumb']),
    };
  }

  // Extract categories from _embedded or portfolio_categories
  let portfolio_categories = raw.portfolio_categories || [];
  
  if (raw._embedded?.['wp:term']?.[0]) {
    portfolio_categories = raw._embedded['wp:term'][0].map(term => ({
      id: term.id,
      name: term.name,
      slug: term.slug,
      count: 0,
    }));
  }

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title?.rendered || raw.title || '',
    content: raw.content?.rendered || raw.content || '',
    excerpt: raw.excerpt?.rendered || raw.excerpt || '',
    date: raw.date,
    modified: raw.modified,
    featured_image_urls: featured_image_urls as PortfolioItem['featured_image_urls'],
    gallery_images: raw.gallery_images || [],
    portfolio_meta: raw.portfolio_meta || {},
    portfolio_categories,
  };
};

// ============================================
// Base Fetch Function
// ============================================

interface FetchOptions {
  revalidate?: number;
  tags?: string[];
}

const fetchAPI = async <T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  const { revalidate = API_CONFIG.revalidate, tags } = options;
  const url = `${API_CONFIG.baseUrl}${endpoint}`;

  try {
    const response = await fetch(url, {
      next: {
        revalidate,
        tags,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    throw error;
  }
};

// ============================================
// Homepage Data
// ============================================

export const getHomepageData = async (): Promise<HomepageData> => {
  return fetchAPI<HomepageData>(API_CONFIG.endpoints.homepage, {
    tags: ['homepage'],
  });
};

// ============================================
// Site Settings
// ============================================

export const getSiteSettings = async (): Promise<SiteSettings> => {
  return fetchAPI<SiteSettings>(API_CONFIG.endpoints.settings, {
    tags: ['settings'],
    revalidate: 300,
  });
};

// ============================================
// Portfolio API
// ============================================

interface PortfolioQueryParams {
  per_page?: number;
  page?: number;
  category?: string;
  orderby?: 'date' | 'title' | 'menu_order';
  order?: 'asc' | 'desc';
}

export const portfolio = {
  getAll: async (params: PortfolioQueryParams = {}): Promise<PortfolioItem[]> => {
    const { per_page = 12, page = 1, category, orderby = 'date', order = 'desc' } = params;
    
    let endpoint = `${API_CONFIG.endpoints.portfolio}?per_page=${per_page}&page=${page}&orderby=${orderby}&order=${order}&_embed`;
    
    if (category) {
      endpoint += `&portfolio_category=${category}`;
    }

    const rawItems = await fetchAPI<WPPortfolioRaw[]>(endpoint, {
      tags: ['portfolio'],
    });

    return rawItems.map(transformPortfolioItem);
  },

  getFeatured: async (limit = 6): Promise<PortfolioItem[]> => {
    return fetchAPI<PortfolioItem[]>(
      `${API_CONFIG.endpoints.featuredPortfolio}?limit=${limit}`,
      { tags: ['portfolio', 'featured'] }
    );
  },

  getBySlug: async (slug: string): Promise<PortfolioItem | null> => {
    try {
      const rawItems = await fetchAPI<WPPortfolioRaw[]>(
        `${API_CONFIG.endpoints.portfolio}?slug=${slug}&_embed`,
        { tags: ['portfolio', `portfolio-${slug}`] }
      );
      return rawItems[0] ? transformPortfolioItem(rawItems[0]) : null;
    } catch {
      return null;
    }
  },

  getRelated: async (id: number, limit = 3): Promise<PortfolioItem[]> => {
    return fetchAPI<PortfolioItem[]>(
      `${API_CONFIG.baseUrl}/wp-json/dkt/v1/portfolio/${id}/related?limit=${limit}`,
      { tags: ['portfolio'] }
    );
  },

  getCategories: async (): Promise<PortfolioCategory[]> => {
    return fetchAPI<PortfolioCategory[]>(
      `${API_CONFIG.baseUrl}/wp-json/wp/v2/portfolio_category`,
      { tags: ['portfolio-categories'], revalidate: 300 }
    );
  },

  getAllSlugs: async (): Promise<string[]> => {
    const items = await fetchAPI<{ slug: string }[]>(
      `${API_CONFIG.endpoints.portfolio}?per_page=100&_fields=slug`,
      { tags: ['portfolio'] }
    );
    return items.map((item) => item.slug);
  },
};

// ============================================
// Blog API
// ============================================

interface BlogQueryParams {
  per_page?: number;
  page?: number;
  category?: number;
  tag?: number;
}

export const blog = {
  getAll: async (params: BlogQueryParams = {}): Promise<BlogPost[]> => {
    const { per_page = 12, page = 1, category, tag } = params;
    
    let endpoint = `${API_CONFIG.endpoints.posts}?per_page=${per_page}&page=${page}&_embed`;
    
    if (category) {
      endpoint += `&categories=${category}`;
    }
    if (tag) {
      endpoint += `&tags=${tag}`;
    }

    return fetchAPI<BlogPost[]>(endpoint, {
      tags: ['blog'],
    });
  },

  getRecent: async (limit = 3): Promise<BlogPost[]> => {
    return fetchAPI<BlogPost[]>(
      `${API_CONFIG.endpoints.posts}?per_page=${limit}&_embed`,
      { tags: ['blog'] }
    );
  },

  getBySlug: async (slug: string): Promise<BlogPost | null> => {
    try {
      const posts = await fetchAPI<BlogPost[]>(
        `${API_CONFIG.endpoints.posts}?slug=${slug}&_embed`,
        { tags: ['blog', `blog-${slug}`] }
      );
      return posts[0] || null;
    } catch {
      return null;
    }
  },

  getAllSlugs: async (): Promise<string[]> => {
    const posts = await fetchAPI<{ slug: string }[]>(
      `${API_CONFIG.endpoints.posts}?per_page=100&_fields=slug`,
      { tags: ['blog'] }
    );
    return posts.map((post) => post.slug);
  },
};

// ============================================
// Services API
// ============================================

export const getServices = async (): Promise<Service[]> => {
  try {
    return await fetchAPI<Service[]>(API_CONFIG.endpoints.services, {
      tags: ['services'],
      revalidate: 300,
    });
  } catch {
    // Return fallback data if API fails
    const { SERVICES_DATA } = await import('./constants');
    return SERVICES_DATA;
  }
};

// ============================================
// Testimonials API
// ============================================

export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    return await fetchAPI<Testimonial[]>(API_CONFIG.endpoints.testimonials, {
      tags: ['testimonials'],
      revalidate: 300,
    });
  } catch {
    // Return fallback data if API fails
    const { TESTIMONIALS_DATA } = await import('./constants');
    return TESTIMONIALS_DATA;
  }
};

// ============================================
// Menu API
// ============================================

export const getMenu = async (location: string): Promise<Menu> => {
  return fetchAPI<Menu>(`${API_CONFIG.endpoints.menus}/${location}`, {
    tags: ['menu'],
    revalidate: 300,
  });
};

// ============================================
// Contact Form
// ============================================

export const submitContactForm = async (
  data: ContactFormData
): Promise<FormResponse> => {
  // Check honeypot
  if (data.website) {
    return { success: false, message: 'Spam detected' };
  }

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.contact}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Failed to submit form',
      };
    }

    return {
      success: true,
      message: result.message || 'Message sent successfully!',
    };
  } catch (error) {
    console.error('Contact form error:', error);
    return {
      success: false,
      message: 'An error occurred. Please try again.',
    };
  }
};

// ============================================
// Search API
// ============================================

interface SearchResult {
  id: number;
  type: 'portfolio' | 'post' | 'page';
  title: string;
  slug: string;
  excerpt: string;
}

export const search = async (query: string): Promise<SearchResult[]> => {
  if (!query || query.length < 3) return [];

  return fetchAPI<SearchResult[]>(
    `${API_CONFIG.baseUrl}/wp-json/wp/v2/search?search=${encodeURIComponent(query)}&per_page=10`,
    { revalidate: 0 }
  );
};
