'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button, Input, Textarea, Select } from '@/components/ui';
import { Reveal, Parallax, Magnetic } from '@/components/animations';
import { submitContactForm } from '@/lib/api';
import { isValidEmail, formatPhoneLink, cn } from '@/lib/utils';
import { CONTACT_INFO, PROJECT_TYPES } from '@/lib/constants';
import { useReducedMotion } from '@/hooks';
import type { ContactFormData } from '@/types';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  Check,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================
// Animation Configuration
// ============================================

const CONTACT_ANIMATION = {
  form: {
    duration: 0.8,
    stagger: 0.1,
    ease: 'expo.out',
  },
  success: {
    duration: 0.6,
    ease: [0.34, 1.56, 0.64, 1], // Bounce
  },
};

// ============================================
// Types
// ============================================

interface ContactSectionProps {
  showContactInfo?: boolean;
  variant?: 'split' | 'centered' | 'minimal';
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

// ============================================
// Contact Section Component
// ============================================

export const ContactSection = ({
  showContactInfo = true,
  variant = 'split',
}: ContactSectionProps) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    project_type: '',
    message: '',
    website: '', // honeypot
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const decorativeRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Project type options
  const projectTypeOptions = [
    { value: '', label: 'Select a project type' },
    ...PROJECT_TYPES.map((type) => ({ value: type, label: type })),
  ];

  // ============================================
  // Decorative Animation
  // ============================================

  useEffect(() => {
    if (prefersReducedMotion) return;

    const decorative = decorativeRef.current;
    if (!decorative) return;

    const ctx = gsap.context(() => {
      // Animate decorative lines
      const lines = decorative.querySelectorAll('.contact-line');
      gsap.fromTo(
        lines,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: decorative,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, decorative);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // ============================================
  // Form Validation
  // ============================================

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please enter a message';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================
  // Form Handlers
  // ============================================

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Shake form on error
      if (formRef.current && !prefersReducedMotion) {
        gsap.fromTo(
          formRef.current,
          { x: 0 },
          {
            keyframes: [
              { x: -10, duration: 0.1 },
              { x: 10, duration: 0.1 },
              { x: -10, duration: 0.1 },
              { x: 10, duration: 0.1 },
              { x: 0, duration: 0.1 },
            ],
            ease: 'power2.out',
          }
        );
      }
      return;
    }

    setStatus('submitting');

    try {
      const response = await submitContactForm(formData);

      if (response.success) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          project_type: '',
          message: '',
          website: '',
        });

        // Reset after delay
        setTimeout(() => setStatus('idle'), 6000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden bg-cream py-24 md:py-32"
    >
      {/* ============================================ */}
      {/* Background Elements */}
      {/* ============================================ */}
      <div ref={decorativeRef} className="pointer-events-none absolute inset-0">
        {/* Pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Decorative lines */}
        <div
          className="contact-line absolute left-0 top-1/4 h-px w-1/4 bg-gradient-to-r from-gold/30 to-transparent"
          style={{ transformOrigin: 'left' }}
        />
        <div
          className="contact-line absolute bottom-1/3 right-0 h-px w-1/3 bg-gradient-to-l from-gold/20 to-transparent"
          style={{ transformOrigin: 'right' }}
        />

        {/* Floating shapes */}
        <Parallax speed={0.15} className="absolute -right-20 top-20">
          <div className="h-40 w-40 rounded-full bg-gold/5" />
        </Parallax>
        <Parallax speed={0.2} className="absolute -left-16 bottom-32">
          <div className="h-32 w-32 rotate-45 border border-gold/10" />
        </Parallax>
      </div>

      <div className="container relative mx-auto px-6">
        {/* ============================================ */}
        {/* Section Header */}
        {/* ============================================ */}
        <div className="mb-16 text-center">
          <Reveal direction="up" distance={30}>
            <p className="mb-5 font-sans text-xs uppercase tracking-[0.4em] text-gold">
              Get In Touch
            </p>
          </Reveal>

          <Reveal delay={0.1} direction="up" distance={40}>
            <h2 className="mb-6 font-display text-4xl font-light text-black md:text-5xl lg:text-6xl">
              Start Your Project
            </h2>
          </Reveal>

          <Reveal delay={0.2} direction="up" distance={30} blur>
            <p className="mx-auto max-w-2xl font-sans text-lg text-neutral-500">
              Ready to transform your space? We&apos;d love to hear about your
              project and discuss how we can bring your vision to life.
            </p>
          </Reveal>
        </div>

        {/* ============================================ */}
        {/* Content Grid */}
        {/* ============================================ */}
        <div
          className={cn(
            'grid gap-12 lg:gap-20',
            variant === 'split' && showContactInfo
              ? 'lg:grid-cols-2'
              : 'mx-auto max-w-2xl'
          )}
        >
          {/* ============================================ */}
          {/* Contact Info Column */}
          {/* ============================================ */}
          {showContactInfo && variant === 'split' && (
            <div className="space-y-8">
              <Reveal direction="left" distance={40}>
                <div>
                  <h3 className="mb-4 font-display text-2xl text-black">
                    Let&apos;s Create Something{' '}
                    <span className="italic text-gold">Beautiful</span>
                  </h3>
                  <p className="font-sans leading-relaxed text-neutral-600">
                    Whether you&apos;re envisioning a complete home transformation
                    or seeking guidance on a single room, we&apos;re here to help
                    bring your dream space to life.
                  </p>
                </div>
              </Reveal>

              {/* Contact Details */}
              <div className="space-y-6">
                <ContactInfoItem
                  icon={Phone}
                  label="Phone"
                  value={CONTACT_INFO.phone}
                  href={`tel:${formatPhoneLink(CONTACT_INFO.phone)}`}
                  delay={0.3}
                />

                <ContactInfoItem
                  icon={Mail}
                  label="Email"
                  value={CONTACT_INFO.email}
                  href={`mailto:${CONTACT_INFO.email}`}
                  delay={0.4}
                />

                <ContactInfoItem
                  icon={MapPin}
                  label="Location"
                  value={CONTACT_INFO.address}
                  subValue="Serving the DFW Metroplex"
                  delay={0.5}
                />
              </div>

              {/* Decorative element */}
              <Reveal delay={0.6}>
                <div className="mt-10 flex items-center gap-4">
                  <div className="h-px flex-1 bg-gold/20" />
                  <Sparkles size={20} className="text-gold/40" aria-hidden="true" />
                  <div className="h-px flex-1 bg-gold/20" />
                </div>
              </Reveal>
            </div>
          )}

          {/* ============================================ */}
          {/* Form Column */}
          {/* ============================================ */}
          <Reveal delay={variant === 'split' ? 0.2 : 0.3}>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="relative space-y-6"
              noValidate
            >
              {/* Form Background */}
              <div className="absolute inset-0 -m-8 rounded-lg bg-white/50 backdrop-blur-sm" />

              <div className="relative space-y-6 p-8">
                {/* Name & Email Row */}
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    label="Name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('name')}
                    onBlur={handleBlur}
                    error={errors.name}
                    placeholder="Your name"
                    required
                    autoComplete="name"
                    isFocused={focusedField === 'name'}
                  />

                  <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={handleBlur}
                    error={errors.email}
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                    isFocused={focusedField === 'email'}
                  />
                </div>

                {/* Phone & Project Type Row */}
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('phone')}
                    onBlur={handleBlur}
                    placeholder="(555) 555-5555"
                    autoComplete="tel"
                    isFocused={focusedField === 'phone'}
                  />

                  <div className="space-y-2">
                    <label
                      htmlFor="project_type"
                      className="block font-sans text-xs uppercase tracking-widest text-neutral-500"
                    >
                      Project Type
                    </label>
                    <select
                      id="project_type"
                      name="project_type"
                      value={formData.project_type || ''}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('project_type')}
                      onBlur={handleBlur}
                      className={cn(
                        'w-full border-0 border-b-2 bg-transparent px-0 py-3',
                        'font-sans text-black placeholder:text-neutral-400',
                        'transition-colors duration-300',
                        'focus:outline-none focus:ring-0',
                        focusedField === 'project_type'
                          ? 'border-gold'
                          : 'border-neutral-200 hover:border-neutral-400'
                      )}
                    >
                      {projectTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="block font-sans text-xs uppercase tracking-widest text-neutral-500"
                  >
                    Message <span className="text-gold">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('message')}
                    onBlur={handleBlur}
                    placeholder="Tell us about your project..."
                    rows={5}
                    required
                    className={cn(
                      'w-full resize-none border-0 border-b-2 bg-transparent px-0 py-3',
                      'font-sans text-black placeholder:text-neutral-400',
                      'transition-colors duration-300',
                      'focus:outline-none focus:ring-0',
                      errors.message
                        ? 'border-red-500'
                        : focusedField === 'message'
                        ? 'border-gold'
                        : 'border-neutral-200 hover:border-neutral-400'
                    )}
                  />
                  {errors.message && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-sans text-sm text-red-500"
                    >
                      {errors.message}
                    </motion.p>
                  )}
                </div>

                {/* Honeypot */}
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                {/* Submit Button */}
                <div className="pt-4">
                  <Magnetic strength={0.08}>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={status === 'submitting'}
                      className="group w-full md:w-auto"
                    >
                      <span>Send Message</span>
                      {status !== 'submitting' && (
                        <ArrowRight
                          size={18}
                          className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      )}
                    </Button>
                  </Magnetic>
                </div>

                {/* Status Messages */}
                <AnimatePresence mode="wait">
                  {status === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{
                        duration: CONTACT_ANIMATION.success.duration,
                        ease: CONTACT_ANIMATION.success.ease,
                      }}
                      className="flex items-center gap-4 rounded-lg bg-green-50 p-4 text-green-700"
                      role="alert"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <Check size={20} aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-sans font-medium">Message sent!</p>
                        <p className="font-sans text-sm text-green-600">
                          We&apos;ll be in touch within 24-48 hours.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-4 rounded-lg bg-red-50 p-4 text-red-700"
                      role="alert"
                    >
                      <AlertCircle size={20} aria-hidden="true" />
                      <p className="font-sans text-sm">
                        Something went wrong. Please try again or email us directly.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

// ============================================
// Contact Info Item Component
// ============================================

interface ContactInfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subValue?: string;
  href?: string;
  delay?: number;
}

const ContactInfoItem = ({
  icon: Icon,
  label,
  value,
  subValue,
  href,
  delay = 0,
}: ContactInfoItemProps) => {
  const content = (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/30 transition-colors duration-300 group-hover:border-gold group-hover:bg-gold/5">
        <Icon size={20} className="text-gold" aria-hidden="true" />
      </div>
      <div>
        <p className="mb-1 font-sans text-xs uppercase tracking-widest text-neutral-400">
          {label}
        </p>
        <p className="font-sans text-black transition-colors duration-300 group-hover:text-gold">
          {value}
        </p>
        {subValue && (
          <p className="mt-0.5 font-sans text-sm text-neutral-500">{subValue}</p>
        )}
      </div>
    </div>
  );

  return (
    <Reveal delay={delay} direction="left" distance={30}>
      {href ? (
        <a href={href} className="group block">
          {content}
        </a>
      ) : (
        <div className="group">{content}</div>
      )}
    </Reveal>
  );
};

// ============================================
// Form Field Component
// ============================================

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  isFocused?: boolean;
}

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  placeholder,
  required,
  autoComplete,
  isFocused,
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block font-sans text-xs uppercase tracking-widest text-neutral-500"
      >
        {label} {required && <span className="text-gold">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className={cn(
          'w-full border-0 border-b-2 bg-transparent px-0 py-3',
          'font-sans text-black placeholder:text-neutral-400',
          'transition-colors duration-300',
          'focus:outline-none focus:ring-0',
          error
            ? 'border-red-500'
            : isFocused
            ? 'border-gold'
            : 'border-neutral-200 hover:border-neutral-400'
        )}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-sans text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default ContactSection;
