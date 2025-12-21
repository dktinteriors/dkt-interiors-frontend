import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ============================================
// Class Name Utilities
// ============================================

/**
 * Merges Tailwind classes with clsx
 */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

// ============================================
// String Utilities
// ============================================

/**
 * Strips HTML tags from a string
 */
export const stripHtml = (html: string): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};

/**
 * Generates an excerpt from content
 */
export const generateExcerpt = (content: string, length = 150): string => {
  const stripped = stripHtml(content);
  if (stripped.length <= length) return stripped;
  return `${stripped.slice(0, length).trim()}...`;
};

/**
 * Converts string to slug format
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Capitalizes first letter of each word
 */
export const capitalize = (text: string): string => {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

// ============================================
// Date Utilities
// ============================================

/**
 * Formats a date string
 */
export const formatDate = (
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  } catch {
    return dateString;
  }
};

/**
 * Calculates reading time for content
 */
export const getReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const stripped = stripHtml(content);
  const wordCount = stripped.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// ============================================
// Validation Utilities
// ============================================

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number format
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-()]+$/;
  return phone.length >= 10 && phoneRegex.test(phone);
};

// ============================================
// Format Utilities
// ============================================

/**
 * Formats phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

/**
 * Formats phone number for tel: link
 */
export const formatPhoneLink = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  return `+1${cleaned}`;
};

// ============================================
// Number Utilities
// ============================================

/**
 * Clamps a number between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Maps a value from one range to another
 */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

/**
 * Linear interpolation
 */
export const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor;
};

// ============================================
// Function Utilities
// ============================================

/**
 * Debounces a function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttles a function
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

// ============================================
// DOM Utilities
// ============================================

/**
 * Checks if code is running on client
 */
export const isClient = (): boolean => {
  return typeof window !== 'undefined';
};

/**
 * Checks if device is mobile
 */
export const isMobile = (): boolean => {
  if (!isClient()) return false;
  return window.innerWidth < 768;
};

/**
 * Checks if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (!isClient()) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// ============================================
// Array Utilities
// ============================================

/**
 * Chunks an array into smaller arrays
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Shuffles an array
 */
export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// ============================================
// URL Utilities
// ============================================

/**
 * Builds a URL with query parameters
 */
export const buildUrl = (base: string, params: Record<string, string | number | boolean | undefined>): string => {
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
};

/**
 * Extracts domain from URL
 */
export const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return url;
  }
};
