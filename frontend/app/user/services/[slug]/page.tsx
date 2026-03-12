'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getServiceBySlug } from '../services-data';
import ServiceLayout from '../components/ServiceLayout';
import ServiceBanner from '../components/ServiceBanner';
import ServiceSections from '../components/ServiceSections';

export default function ServicePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const service = slug ? getServiceBySlug(slug) : undefined;

  if (!service) {
    return (
      <ServiceLayout>
        <main className="min-h-screen pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
            <h1 className="font-display font-bold text-3xl text-cinema-white mb-4">
              Service not found
            </h1>
            <p className="text-cinema-muted mb-6">
              The service you’re looking for doesn’t exist or has been moved.
            </p>
            <Link
              href="/user#services"
              className="inline-flex items-center gap-2 text-cinema-gold hover:text-cinema-gold-hover font-medium"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Services
            </Link>
          </div>
        </main>
      </ServiceLayout>
    );
  }

  return (
    <ServiceLayout>
      <ServiceBanner config={service.banner} />
      <ServiceSections sections={service.sections} />
    </ServiceLayout>
  );
}
