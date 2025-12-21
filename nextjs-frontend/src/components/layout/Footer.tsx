'use client';

import Link from 'next/link';
import { NAV_LINKS, CONTACT_INFO, SOCIAL_LINKS, SERVICES_DATA } from '@/lib/constants';
import { formatPhoneLink } from '@/lib/utils';
import { Reveal } from '@/components/animations';
import { Instagram, Facebook, Linkedin, type LucideIcon } from 'lucide-react';

const socialIcons: Record<string, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <Reveal>
            <div>
              <Link
                href="/"
                className="mb-4 inline-block font-display text-2xl font-medium tracking-wider"
                aria-label="DKT Interiors - Home"
              >
                DKT INTERIORS
              </Link>
              <p className="mb-6 font-sans text-sm leading-relaxed text-neutral-400">
                Creating sophisticated, modern interiors that reflect your unique
                style and enhance your daily life through thoughtful design and
                careful curation.
              </p>
              {/* Social Links */}
              <div className="flex gap-4">
                {Object.entries(SOCIAL_LINKS).map(([platform, url]) => {
                  const Icon = socialIcons[platform];
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-700 text-neutral-400 transition-all duration-300 hover:border-gold hover:text-gold"
                      aria-label={`Follow us on ${platform}`}
                    >
                      {Icon && <Icon size={18} />}
                    </a>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Navigation Column */}
          <Reveal delay={0.1}>
            <div>
              <h3 className="mb-6 font-display text-lg">Navigation</h3>
              <nav aria-label="Footer Navigation">
                <ul className="space-y-3">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="font-sans text-sm text-neutral-400 transition-colors hover:text-gold"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </Reveal>

          {/* Services Column */}
          <Reveal delay={0.2}>
            <div>
              <h3 className="mb-6 font-display text-lg">Services</h3>
              <ul className="space-y-3">
                {SERVICES_DATA.map((service) => (
                  <li key={service.id}>
                    <span className="font-sans text-sm text-neutral-400">
                      {service.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Contact Column */}
          <Reveal delay={0.3}>
            <div>
              <h3 className="mb-6 font-display text-lg">Contact</h3>
              <address className="space-y-4 not-italic">
                <div>
                  <p className="mb-1 text-xs uppercase tracking-widest text-gold">
                    Phone
                  </p>
                  <a
                    href={`tel:${formatPhoneLink(CONTACT_INFO.phone)}`}
                    className="font-sans text-sm text-neutral-400 transition-colors hover:text-gold"
                  >
                    {CONTACT_INFO.phone}
                  </a>
                </div>
                <div>
                  <p className="mb-1 text-xs uppercase tracking-widest text-gold">
                    Email
                  </p>
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="font-sans text-sm text-neutral-400 transition-colors hover:text-gold"
                  >
                    {CONTACT_INFO.email}
                  </a>
                </div>
                <div>
                  <p className="mb-1 text-xs uppercase tracking-widest text-gold">
                    Location
                  </p>
                  <p className="font-sans text-sm text-neutral-400">
                    {CONTACT_INFO.address}
                  </p>
                </div>
              </address>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row">
          <p className="font-sans text-xs text-neutral-500">
            © {currentYear} DKT Interiors. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="font-sans text-xs text-neutral-500 transition-colors hover:text-gold"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="font-sans text-xs text-neutral-500 transition-colors hover:text-gold"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
