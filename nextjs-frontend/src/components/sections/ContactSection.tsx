'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input, Textarea, Select } from '@/components/ui';
import { Reveal } from '@/components/animations';
import { submitContactForm } from '@/lib/api';
import { isValidEmail } from '@/lib/utils';
import { CONTACT_INFO, PROJECT_TYPES } from '@/lib/constants';
import { formatPhoneLink } from '@/lib/utils';
import type { ContactFormData } from '@/types';
import { Phone, Mail, MapPin, Send, Check, AlertCircle } from 'lucide-react';

interface ContactSectionProps {
  showContactInfo?: boolean;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export const ContactSection = ({ showContactInfo = true }: ContactSectionProps) => {
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

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
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const projectTypeOptions = PROJECT_TYPES.map((type) => ({
    value: type,
    label: type,
  }));

  return (
    <section id="contact" className="bg-cream py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left Column - Info */}
          {showContactInfo && (
            <div>
              <Reveal>
                <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-gold">
                  Get In Touch
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <h2 className="mb-6 font-display text-4xl font-light text-black md:text-5xl">
                  Let&apos;s Create Something{' '}
                  <span className="italic text-gold">Beautiful</span>
                </h2>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="mb-12 font-sans leading-relaxed text-neutral-600">
                  Ready to transform your space? We&apos;d love to hear about
                  your project and discuss how we can bring your vision to life.
                  Reach out to schedule a consultation.
                </p>
              </Reveal>

              {/* Contact Info Items */}
              <div className="space-y-6">
                <Reveal delay={0.3}>
                  <a
                    href={`tel:${formatPhoneLink(CONTACT_INFO.phone)}`}
                    className="group flex items-center gap-4"
                    aria-label={`Call us at ${CONTACT_INFO.phone}`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 transition-all duration-300 group-hover:border-gold group-hover:bg-gold/5">
                      <Phone size={18} className="text-gold" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="mb-1 font-sans text-xs uppercase tracking-widest text-neutral-400">
                        Phone
                      </p>
                      <p className="font-sans text-black transition-colors group-hover:text-gold">
                        {CONTACT_INFO.phone}
                      </p>
                    </div>
                  </a>
                </Reveal>

                <Reveal delay={0.4}>
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="group flex items-center gap-4"
                    aria-label={`Email us at ${CONTACT_INFO.email}`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 transition-all duration-300 group-hover:border-gold group-hover:bg-gold/5">
                      <Mail size={18} className="text-gold" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="mb-1 font-sans text-xs uppercase tracking-widest text-neutral-400">
                        Email
                      </p>
                      <p className="font-sans text-black transition-colors group-hover:text-gold">
                        {CONTACT_INFO.email}
                      </p>
                    </div>
                  </a>
                </Reveal>

                <Reveal delay={0.5}>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30">
                      <MapPin size={18} className="text-gold" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="mb-1 font-sans text-xs uppercase tracking-widest text-neutral-400">
                        Location
                      </p>
                      <p className="font-sans text-black">
                        {CONTACT_INFO.address}
                        <br />
                        <span className="text-neutral-500">
                          Serving the DFW Metroplex
                        </span>
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          )}

          {/* Right Column - Form */}
          <Reveal delay={0.2}>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid gap-6 md:grid-cols-2">
                <Input
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={errors.name}
                  placeholder="Your name"
                  required
                  autoComplete="name"
                />

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  placeholder="your@email.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Input
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(555) 555-5555"
                  autoComplete="tel"
                />

                <Select
                  label="Project Type"
                  name="project_type"
                  value={formData.project_type}
                  onChange={handleInputChange}
                  options={projectTypeOptions}
                  placeholder="Select a project type"
                />
              </div>

              <Textarea
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                error={errors.message}
                placeholder="Tell us about your project..."
                rows={5}
                required
              />

              {/* Honeypot - hidden from users */}
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

              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={status === 'submitting'}
                  rightIcon={
                    status !== 'submitting' && (
                      <Send size={16} aria-hidden="true" />
                    )
                  }
                  className="w-full md:w-auto"
                >
                  Send Message
                </Button>
              </div>

              {/* Status Messages */}
              <AnimatePresence>
                {(status === 'success' || status === 'error') && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex items-center gap-3 rounded p-4 ${
                      status === 'success'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                    role="alert"
                  >
                    {status === 'success' ? (
                      <>
                        <Check size={20} aria-hidden="true" />
                        <span className="font-sans text-sm">
                          Thank you! Your message has been sent successfully.
                          We&apos;ll be in touch soon.
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={20} aria-hidden="true" />
                        <span className="font-sans text-sm">
                          Something went wrong. Please try again or contact us
                          directly.
                        </span>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
