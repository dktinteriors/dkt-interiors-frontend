'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { NAV_LINKS, CONTACT_INFO, SOCIAL_LINKS } from '@/lib/constants';
import { useScrollPosition, useLockBodyScroll, useKeyPress } from '@/hooks';
import { Magnetic } from '@/components/animations';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { y: scrollY } = useScrollPosition();

  const isScrolled = scrollY > 50;

  // Lock body scroll when menu is open
  useLockBodyScroll(isMenuOpen);

  // Close menu on escape key
  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useKeyPress('Escape', handleCloseMenu);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleMenuKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggleMenu();
    }
  };

  return (
    <>
      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-50',
          'transition-all duration-300',
          isScrolled
            ? 'bg-white/90 py-4 shadow-sm backdrop-blur-md'
            : 'bg-transparent py-6'
        )}
      >
        <div className="container mx-auto flex items-center justify-between px-6">
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-xl font-medium tracking-wider text-black transition-colors hover:text-gold"
            aria-label="DKT Interiors - Home"
          >
            DKT INTERIORS
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label="Main Navigation"
          >
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative py-2 font-sans text-sm font-medium uppercase tracking-widest',
                    'transition-colors duration-300',
                    isActive ? 'text-black' : 'text-neutral-600 hover:text-black'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                  <span
                    className={cn(
                      'absolute -bottom-0.5 left-0 h-px bg-gold',
                      'transition-all duration-300',
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={handleToggleMenu}
            onKeyDown={handleMenuKeyDown}
            className="relative z-50 flex h-10 w-10 items-center justify-center md:hidden"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <div className="flex h-4 w-6 flex-col justify-between">
              <span
                className={cn(
                  'h-0.5 w-full bg-black transition-all duration-300',
                  isMenuOpen && 'translate-y-1.5 rotate-45'
                )}
              />
              <span
                className={cn(
                  'h-0.5 w-full bg-black transition-all duration-300',
                  isMenuOpen && 'opacity-0'
                )}
              />
              <span
                className={cn(
                  'h-0.5 w-full bg-black transition-all duration-300',
                  isMenuOpen && '-translate-y-1.5 -rotate-45'
                )}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Menu"
          >
            <div className="text-center">
              {/* Navigation Links */}
              <nav aria-label="Mobile Navigation">
                <ul className="space-y-6">
                  {NAV_LINKS.map((link, index) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          'font-display text-4xl font-light text-white',
                          'transition-colors duration-300 hover:text-gold',
                          pathname === link.href && 'text-gold'
                        )}
                        tabIndex={0}
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 space-y-4"
              >
                <a
                  href={`tel:+1${CONTACT_INFO.phone.replace(/\D/g, '')}`}
                  className="block font-sans text-sm text-white/70 transition-colors hover:text-gold"
                >
                  {CONTACT_INFO.phone}
                </a>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="block font-sans text-sm text-white/70 transition-colors hover:text-gold"
                >
                  {CONTACT_INFO.email}
                </a>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 flex justify-center gap-6"
              >
                {Object.entries(SOCIAL_LINKS).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-xs uppercase tracking-widest text-white/50 transition-colors hover:text-gold"
                    aria-label={`Visit our ${platform}`}
                  >
                    {platform}
                  </a>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
