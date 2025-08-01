'use client';

import { Conference } from '@/types/conference';
import { Container } from '@/components/ResponsiveGrid';
import { getPublicStorageUrl } from '@/lib/firebase';
import Image from 'next/image';

interface ConferenceDetailsSectionProps {
  conference: Conference;
  availability: {
    isAvailable: boolean;
    spotsRemaining: number;
    registrationStatus: 'open' | 'closed' | 'full' | 'not_started';
  };
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour24 = parseInt(hours);
  const hour12 = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24;
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  return `${hour12}:${minutes} ${ampm}`;
}

export default function ConferenceDetailsSection({ conference, availability }: ConferenceDetailsSectionProps) {
  return (
    <section className="py-16">
      <Container size="lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-medium text-[var(--nhbea-royal-blue-deeper)] mb-6">
            Event Details
          </h2>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            Everything you need to know about joining us for this transformative experience
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Date & Time */}
          <div className="bg-white rounded-2xl p-8 border-2 border-[var(--color-border-primary)] shadow-lg">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[var(--nhbea-royal-blue)] to-[var(--nhbea-royal-blue-dark)] rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-medium text-[var(--color-text-primary)] mb-2">When</h3>
                <p className="text-lg text-[var(--color-text-secondary)] mb-1">{formatDate(conference.schedule.date)}</p>
                <p className="text-[var(--color-text-secondary)]">
                  {formatTime(conference.schedule.startTime)} - {formatTime(conference.schedule.endTime)} {conference.schedule.timezone}
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl p-8 border-2 border-[var(--color-border-primary)] shadow-lg">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[var(--nhbea-royal-blue-light)] to-[var(--nhbea-royal-blue)] rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-medium text-[var(--color-text-primary)] mb-2">Where</h3>
                <p className="text-lg text-[var(--color-text-secondary)] font-medium mb-1">{conference.location.venue}</p>
                <p className="text-[var(--color-text-secondary)]">
                  {conference.location.address.street}<br />
                  {conference.location.address.city}, {conference.location.address.state} {conference.location.address.zipCode}
                </p>
                {conference.location.virtualOption && (
                  <div className="mt-3 inline-flex items-center px-3 py-1 bg-[var(--nhbea-royal-blue)]/10 rounded-full">
                    <div className="w-2 h-2 bg-[var(--nhbea-royal-blue)] rounded-full mr-2"></div>
                    <span className="text-sm text-[var(--nhbea-royal-blue)] font-medium">Virtual option available</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Capacity & Availability */}
          <div className="bg-white rounded-2xl p-8 border-2 border-[var(--color-border-primary)] shadow-lg">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[var(--nhbea-accent-orange)] to-[var(--nhbea-accent-orange-dark)] rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-medium text-[var(--color-text-primary)] mb-2">Availability</h3>
                <p className="text-lg text-[var(--color-text-secondary)] mb-3">{conference.registration.capacity} total capacity</p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-[var(--nhbea-royal-blue)] to-[var(--nhbea-royal-blue-dark)] h-3 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.max(0, ((conference.registration.capacity - availability.spotsRemaining) / conference.registration.capacity) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <span className="ml-4 text-sm font-medium text-[var(--color-text-secondary)] whitespace-nowrap">
                      {availability.spotsRemaining} spots left
                    </span>
                  </div>
                  {availability.spotsRemaining < 20 && availability.spotsRemaining > 0 && (
                    <p className="text-[var(--nhbea-accent-orange-dark)] font-medium">
                      ⚡ Limited availability - secure your spot soon!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Conference Venue Image */}
          <div className="bg-white rounded-2xl p-8 border-2 border-[var(--color-border-primary)] shadow-lg">
            <div className="mb-6">
              <h3 className="text-xl font-medium text-[var(--color-text-primary)] mb-2">Conference Venue</h3>
              <p className="text-[var(--color-text-secondary)]">
                Get a preview of our beautiful conference location
              </p>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <Image
                src={getPublicStorageUrl(conference.media?.imageURL || 'https://firebasestorage.googleapis.com/v0/b/nhbea-64cab.firebasestorage.app/o/conference_images%2Ftqupg_2025%20NHBEA%20Annual%20Conference.jpg?alt=media')}
                alt={`${conference.title} venue - ${conference.location.venue}`}
                width={800}
                height={400}
                className="w-full h-80 object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}