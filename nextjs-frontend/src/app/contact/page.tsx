import type { Metadata } from 'next';
import { PageHero } from '@/components/layout';
import { ContactSection } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with DKT Interiors. Schedule a consultation to discuss your interior design project in Flower Mound, Texas and the DFW area.',
};

const ContactPage = () => {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's Work Together"
        description="Ready to transform your space? We'd love to hear about your project and discuss how we can bring your vision to life."
      />

      <ContactSection showContactInfo />
    </>
  );
};

export default ContactPage;
