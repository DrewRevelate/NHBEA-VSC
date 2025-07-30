import { getCurrentConference, checkRegistrationAvailability, getEnhancedConferenceData } from '@/lib/conference';
import { Conference } from '@/types/conference';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ConferenceThemeProvider } from '@/components/ConferenceTheme';
import ConferenceAgenda from '@/components/ConferenceAgenda';
import SpeakersSection from '@/components/SpeakersSection';
import VenueInformation from '@/components/VenueInformation';
import ConferenceFAQ from '@/components/ConferenceFAQ';
import SocialMediaFeed from '@/components/SocialMediaFeed';
import { Metadata } from 'next';
import Script from 'next/script';
import { StandardPageLayout } from '@/components/StandardPageLayout';
import { FlexibleHero } from '@/components/FlexibleHero';
import { ResponsiveGrid, Container } from '@/components/ResponsiveGrid';
import { StandardErrorBoundary } from '@/components/StandardErrorBoundary';
import { LoadingSpinner, LoadingSkeleton } from '@/components/LoadingSpinner';
import { Suspense, lazy } from 'react';

// Lazy load non-critical components
const LazyConferenceFAQ = lazy(() => import('@/components/ConferenceFAQ'));
const LazySocialMediaFeed = lazy(() => import('@/components/SocialMediaFeed'));
const LazyVenueInformation = lazy(() => import('@/components/VenueInformation'));

// Generate dynamic metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const conference = await getCurrentConference();
  
  if (!conference) {
    return {
      title: 'Conference - NHBEA',
      description: 'Join the New Hampshire Business Education Association annual conference for professional development, networking, and the latest in business education.',
    };
  }

  // conferenceDate removed as it's unused

  return {
    title: `${conference.title} | NHBEA Conference`,
    description: conference.description,
    keywords: ['business education', 'conference', 'New Hampshire', 'NHBEA', 'professional development', 'educators', 'networking'],
    openGraph: {
      title: conference.title,
      description: conference.description,
      type: 'website',
      locale: 'en_US',
      url: `https://nhbea.org/conference`,
      siteName: 'NHBEA',
      images: conference.media.imageURL ? [
        {
          url: conference.media.imageURL,
          width: 1200,
          height: 630,
          alt: conference.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: conference.title,
      description: conference.description,
      site: '@NHBEA_Official',
      creator: '@NHBEA_Official',
      images: conference.media.imageURL ? [conference.media.imageURL] : [],
    },
    other: {
      'event:name': conference.title,
      'event:start_date': conference.schedule.date.toISOString(),
      'event:location': `${conference.location.venue}, ${conference.location.address.city}, ${conference.location.address.state}`,
      'event:ticket_url': 'https://nhbea.org/conference/register'
    }
  };
}

interface ConferenceWithAvailability extends Conference {
  availability: {
    isAvailable: boolean;
    spotsRemaining: number;
    registrationStatus: 'open' | 'closed' | 'full' | 'not_started';
  };
}

async function getConferenceData(): Promise<ConferenceWithAvailability | null> {
  try {
    const conference = await getCurrentConference();
    if (!conference) return null;
    
    // Fetch enhanced conference data with all Story 3.4 features
    const enhancedConference = await getEnhancedConferenceData(conference.id);
    const availability = await checkRegistrationAvailability(conference.id);
    
    return {
      ...(enhancedConference || conference),
      availability
    };
  } catch (error) {
    console.error('Error fetching conference data:', error);
    return null;
  }
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

function getEarlyBirdPrice(conference: Conference): number | null {
  const now = new Date();
  const earlyBird = conference.registration.fees.earlyBird;
  
  if (earlyBird && now <= earlyBird.deadline) {
    return earlyBird.amount;
  }
  
  return null;
}

// getRegistrationStatusMessage function removed as it's unused

export default async function ConferencePage() {
  const conferenceData = await getConferenceData();
  
  if (!conferenceData) {
    return (
      <StandardPageLayout
        hero={{
          component: FlexibleHero,
          props: {
            variant: 'conference' as const,
            title: 'Conference Information',
            subtitle: 'No active conference found. Please check back later for updates on our upcoming professional development opportunities.',
            conference: {
              title: 'Conference Information',
              date: 'Coming Soon',
              location: 'New Hampshire',
              registrationOpen: false
            }
          }
        }}
        meta={{
          title: 'Conference - NHBEA',
          description: 'Join the New Hampshire Business Education Association annual conference for professional development, networking, and the latest in business education.'
        }}
        error={{ boundary: true }}
        loading={{ enabled: true }}
      >
        <Container size="md" className="py-16 text-center">
          <Link href="/">
            <Button className="bg-[var(--nhbea-royal-blue)] hover:bg-[var(--nhbea-royal-blue-dark)] text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              Return Home
            </Button>
          </Link>
        </Container>
      </StandardPageLayout>
    );
  }

  const conference = conferenceData;
  const { availability } = conferenceData;
  const earlyBirdPrice = getEarlyBirdPrice(conference);
  const isEarlyBird = earlyBirdPrice !== null;

  // Use the conference theme if available, otherwise use default theme
  const conferenceTheme = conference.theme || {
    primaryColor: '#2563eb',
    secondaryColor: '#4f46e5', 
    accentColor: '#06b6d4',
    backgroundGradient: {
      from: '#f8fafc',
      to: '#e0f2fe'
    },
    brandingElements: {
      shapingTheFuture: true,
      animatedElements: true
    }
  };

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": conference.title,
    "description": conference.description,
    "startDate": conference.schedule.date.toISOString(),
    "endDate": conference.schedule.date.toISOString(),
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": conference.location.virtualOption 
      ? "https://schema.org/MixedEventAttendanceMode" 
      : "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": conference.location.venue,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": conference.location.address.street,
        "addressLocality": conference.location.address.city,
        "addressRegion": conference.location.address.state,
        "postalCode": conference.location.address.zipCode,
        "addressCountry": "US"
      }
    },
    "organizer": {
      "@type": "Organization",
      "name": "New Hampshire Business Education Association",
      "url": "https://nhbea.org"
    },
    "offers": [
      {
        "@type": "Offer",
        "name": "Member Registration",
        "price": conference.registration.fees.member,
        "priceCurrency": "USD",
        "availability": availability.isAvailable ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
        "url": "https://nhbea.org/conference/register",
        "validFrom": conference.registration.openDate.toISOString()
      },
      {
        "@type": "Offer",
        "name": "Non-Member Registration",
        "price": conference.registration.fees.nonMember,
        "priceCurrency": "USD",
        "availability": availability.isAvailable ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
        "url": "https://nhbea.org/conference/register",
        "validFrom": conference.registration.openDate.toISOString()
      },
      {
        "@type": "Offer",
        "name": "Student Registration",
        "price": conference.registration.fees.student,
        "priceCurrency": "USD",
        "availability": availability.isAvailable ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
        "url": "https://nhbea.org/conference/register",
        "validFrom": conference.registration.openDate.toISOString()
      }
    ],
    "maximumAttendeeCapacity": conference.registration.capacity,
    "remainingAttendeeCapacity": availability.spotsRemaining
  };

  // Add early bird offer if applicable
  if (isEarlyBird && earlyBirdPrice) {
    structuredData.offers.unshift({
      "@type": "Offer",
      "name": "Early Bird Registration",
      "price": earlyBirdPrice,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": "https://nhbea.org/conference/register",
      "validFrom": conference.registration.openDate.toISOString(),
      "priceValidUntil": conference.registration.fees.earlyBird!.deadline.toISOString()
    });
  }

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <Script
        id="conference-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      <ConferenceThemeProvider theme={conferenceTheme}>
        <StandardPageLayout
          hero={{
            component: FlexibleHero,
            props: {
              variant: 'conference' as const,
              title: conference.title,
              subtitle: conference.description,
              conference: {
                title: conference.title,
                date: formatDate(conference.schedule.date),
                location: conference.location.venue,
                registrationOpen: availability.isAvailable,
                earlyBirdDeadline: conference.registration.fees.earlyBird ? formatDate(conference.registration.fees.earlyBird.deadline) : undefined,
                theme: {
                  primaryColor: conferenceTheme.primaryColor,
                  secondaryColor: conferenceTheme.secondaryColor,
                  backgroundImage: conference.media.imageURL
                }
              }
            }
          }}
          meta={{
            title: `${conference.title} | NHBEA Conference`,
            description: conference.description,
            structuredData: structuredData
          }}
          error={{ boundary: true }}
          loading={{ enabled: true }}
        >

          {/* Key Details Bar */}
          <StandardErrorBoundary>
            <section className="py-8 bg-[var(--color-bg-primary)]">
              <Container size="xl">
                <ResponsiveGrid 
                  breakpoints={{ mobile: 1, tablet: 2, desktop: 3 }}
                  gap="md"
                  className="justify-center max-w-4xl mx-auto"
                >
                  <div className="flex items-center space-x-2 bg-white rounded-full px-6 py-3 border-2 border-[var(--color-border-primary)] shadow-lg">
                    <svg className="w-5 h-5 text-[var(--nhbea-royal-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[var(--color-text-primary)] font-semibold">{formatDate(conference.schedule.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white rounded-full px-6 py-3 border-2 border-[var(--color-border-primary)] shadow-lg">
                    <svg className="w-5 h-5 text-[var(--nhbea-royal-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-[var(--color-text-primary)] font-semibold">{conference.location.venue}</span>
                  </div>
                  {availability.spotsRemaining > 0 && availability.spotsRemaining <= 20 && (
                    <div className="flex items-center space-x-2 bg-[var(--nhbea-accent-orange)]/10 backdrop-blur-sm rounded-full px-6 py-3 border border-[var(--nhbea-accent-orange)]/20 shadow-sm">
                      <div className="w-2 h-2 bg-[var(--nhbea-accent-orange)] rounded-full animate-pulse"></div>
                      <span className="text-[var(--nhbea-accent-orange-dark)] font-semibold">Only {availability.spotsRemaining} spots left!</span>
                    </div>
                  )}
                </ResponsiveGrid>

                {/* Primary CTA */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mt-8">
                  {availability.isAvailable ? (
                    <Link href="/conference/register">
                      <Button className="group relative px-12 py-4 bg-[var(--nhbea-accent-orange)] hover:bg-[var(--nhbea-accent-orange-dark)] text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                        <span className="relative z-10">Register Now</span>
                      </Button>
                    </Link>
                  ) : (
                    <Button disabled className="px-12 py-4 bg-gray-400 text-white font-bold text-lg rounded-xl w-full sm:w-auto opacity-60">
                      {availability.registrationStatus === 'not_started' && 'Registration Opens Soon'}
                      {availability.registrationStatus === 'closed' && 'Registration Closed'}
                      {availability.registrationStatus === 'full' && 'Conference Full'}
                    </Button>
                  )}
                  
                  {isEarlyBird && (
                    <div className="flex items-center justify-center bg-green-100/80 backdrop-blur-sm rounded-xl px-6 py-2 border border-green-200/50">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-green-700 font-semibold">Early Bird: ${earlyBirdPrice}</span>
                    </div>
                  )}
                </div>
              </Container>
            </section>
          </StandardErrorBoundary>

          {/* Why Attend Section */}
          <StandardErrorBoundary>
            <section className="relative z-10 py-16">
              <Container size="xl">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold text-[var(--nhbea-royal-blue-deeper)] mb-6">
                    Why Attend This Conference?
                  </h2>
                  <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto leading-relaxed">
                    Join New Hampshire's premier gathering of business educators for an unparalleled professional development experience
                  </p>
                </div>

                <ResponsiveGrid 
                  breakpoints={{ mobile: 1, tablet: 2, desktop: 3 }}
                  gap="lg"
                  className="mb-16"
                >
                  <div className="group p-8 bg-white rounded-2xl border-2 border-[var(--color-border-primary)] shadow-lg hover:shadow-xl hover:border-[var(--nhbea-royal-blue)]/30 transition-all duration-300 hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-r from-[var(--nhbea-royal-blue)] to-[var(--nhbea-royal-blue-dark)] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Cutting-Edge Content</h3>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                      Stay ahead with the latest trends, technologies, and methodologies in business education from industry-leading experts
                    </p>
                  </div>

                  <div className="group p-8 bg-white rounded-2xl border-2 border-[var(--color-border-primary)] shadow-lg hover:shadow-xl hover:border-[var(--nhbea-royal-blue)]/30 transition-all duration-300 hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-r from-[var(--nhbea-royal-blue-light)] to-[var(--nhbea-royal-blue)] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Network & Connect</h3>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                      Build meaningful connections with fellow educators, administrators, and business leaders across New Hampshire
                    </p>
                  </div>

                  <div className="group p-8 bg-white rounded-2xl border-2 border-[var(--color-border-primary)] shadow-lg hover:shadow-xl hover:border-[var(--nhbea-royal-blue)]/30 transition-all duration-300 hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-r from-[var(--nhbea-accent-orange)] to-[var(--nhbea-accent-orange-dark)] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Practical Solutions</h3>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                      Take home actionable strategies and tools you can implement immediately in your classroom or institution
                    </p>
                  </div>
                </ResponsiveGrid>
              </Container>
            </section>
          </StandardErrorBoundary>

          {/* Event Details & Registration */}
          <StandardErrorBoundary>
            <section className="relative z-10 py-16">
              <Container size="xl">
                <ResponsiveGrid 
                  breakpoints={{ mobile: 1, tablet: 1, desktop: 2 }}
                  gap="xl"
                >
            {/* Event Details Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/30 shadow-2xl p-8">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-slate-900">Event Details</h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg mb-1">Date & Time</h3>
                    <p className="text-slate-600 text-lg">{formatDate(conference.schedule.date)}</p>
                    <p className="text-slate-600">
                      {formatTime(conference.schedule.startTime)} - {formatTime(conference.schedule.endTime)}
                    </p>
                    <p className="text-sm text-slate-500">{conference.schedule.timezone}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg mb-1">Location</h3>
                    <p className="text-slate-600 text-lg font-medium">{conference.location.venue}</p>
                    <p className="text-slate-600">
                      {conference.location.address.street}<br />
                      {conference.location.address.city}, {conference.location.address.state} {conference.location.address.zipCode}
                    </p>
                    {conference.location.virtualOption && (
                      <div className="mt-2 inline-flex items-center px-3 py-1 bg-blue-100 rounded-full">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-sm text-blue-700 font-medium">Virtual option available</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg mb-1">Capacity</h3>
                    <p className="text-slate-600 text-lg">{conference.registration.capacity} attendees</p>
                    <div className="mt-2">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${Math.max(0, ((conference.registration.capacity - availability.spotsRemaining) / conference.registration.capacity) * 100)}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-slate-600">
                          {availability.spotsRemaining} spots left
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration & Pricing Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl p-8 text-white">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold">Registration & Pricing</h2>
              </div>
              
              <div className="space-y-6 mb-8">
                {isEarlyBird && (
                  <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-2xl p-6">
                    <div className="flex items-center mb-3">
                      <svg className="w-6 h-6 text-green-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-green-300 font-semibold text-lg">Early Bird Special!</span>
                    </div>
                    <p className="text-3xl font-bold text-green-100 mb-2">${earlyBirdPrice}</p>
                    <p className="text-green-200 text-sm">
                      Available until {formatDate(conference.registration.fees.earlyBird!.deadline)}
                    </p>
                  </div>
                )}
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <h3 className="font-semibold text-xl mb-4 text-white/90">Regular Pricing</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">NHBEA Members</span>
                      <span className="text-2xl font-bold">${conference.registration.fees.member}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Non-Members</span>
                      <span className="text-2xl font-bold">${conference.registration.fees.nonMember}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Students</span>
                      <span className="text-2xl font-bold">${conference.registration.fees.student}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <h3 className="font-semibold text-lg mb-2 text-white/90">Registration Window</h3>
                  <p className="text-white/80">
                    {formatDate(conference.registration.openDate)} - {formatDate(conference.registration.closeDate)}
                  </p>
                </div>
              </div>

              {/* Registration CTAs */}
              <div className="space-y-4">
                {availability.isAvailable ? (
                  <Link href="/conference/register">
                    <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold text-lg py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      Secure Your Spot Now
                    </Button>
                  </Link>
                ) : (
                  <Button disabled className="w-full bg-white/20 text-white/60 font-bold text-lg py-4 rounded-2xl opacity-60">
                    {availability.registrationStatus === 'not_started' && 'Registration Opens Soon'}
                    {availability.registrationStatus === 'closed' && 'Registration Period Ended'}
                    {availability.registrationStatus === 'full' && 'Event at Capacity'}
                  </Button>
                )}
                
                {availability.registrationStatus === 'full' && conference.registration.waitlistEnabled && (
                  <Link href="/conference/register?waitlist=true">
                    <Button className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-2 border-white/30 font-semibold py-3 rounded-2xl transition-all duration-300">
                      Join Waitlist
                    </Button>
                  </Link>
                )}
              </div>
            </div>
                </ResponsiveGrid>
              </Container>
            </section>
          </StandardErrorBoundary>

          {/* Conference Image & Visual Appeal */}
          <StandardErrorBoundary>
            {conference.media.imageURL && (
              <section className="relative z-10 py-16">
                <Container size="xl">
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                    <Suspense fallback={<LoadingSkeleton variant="hero" />}>
                      <Image
                        src={conference.media.imageURL}
                        alt={conference.title}
                        width={1200}
                        height={600}
                        className="w-full h-96 object-cover"
                      />
                    </Suspense>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-8 left-8 text-white">
                      <h3 className="text-2xl font-bold mb-2">Experience Excellence</h3>
                      <p className="text-lg text-white/90">Join New Hampshire's leading business educators</p>
                    </div>
                  </div>
                </Container>
              </section>
            )}
          </StandardErrorBoundary>

          {/* Social Proof & Testimonials */}
          <StandardErrorBoundary>
            <section className="relative z-10 py-16">
              <Container size="xl">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold text-[var(--nhbea-royal-blue-dark)] mb-6">
                    What Attendees Are Saying
                  </h2>
                  <p className="text-xl text-[var(--nhbea-gray-600)] max-w-3xl mx-auto">
                    Don't just take our word for it - hear from business educators who've transformed their careers through our conferences
                  </p>
                </div>

                <ResponsiveGrid 
                  breakpoints={{ mobile: 1, tablet: 2, desktop: 3 }}
                  gap="lg"
                >
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[var(--nhbea-royal-blue)] rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">SJ</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Sarah Johnson</h4>
                  <p className="text-slate-600 text-sm">Business Education Teacher</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 italic">
                  "This conference completely transformed my approach to business education. The practical strategies I learned have made an immediate impact in my classroom."
                </p>
              </div>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[var(--nhbea-royal-blue)] rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">MR</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Michael Roberts</h4>
                  <p className="text-slate-600 text-sm">Department Head</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 italic">
                  "The networking opportunities alone made this worth it. I've formed lasting professional relationships that continue to benefit our students."
                </p>
              </div>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[var(--nhbea-royal-blue)] rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">LT</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Lisa Thompson</h4>
                  <p className="text-slate-600 text-sm">Curriculum Coordinator</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 italic">
                  "Every session was packed with actionable insights. I left with a notebook full of ideas that I'm already implementing in our program."
                </p>
              </div>
            </div>
                </ResponsiveGrid>
              </Container>
            </section>
          </StandardErrorBoundary>

          {/* Additional Resources & Call to Action */}
          <StandardErrorBoundary>
            {(conference.media.brochureURL || conference.media.programURL) && (
              <section className="relative z-10 py-16">
                <Container size="xl">
                  <div className="bg-gradient-to-r from-[var(--nhbea-royal-blue-dark)] to-[var(--nhbea-royal-blue-deeper)] rounded-3xl shadow-2xl p-12 text-white text-center">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">Get More Information</h3>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Download our detailed conference materials to learn more about sessions, speakers, and what makes this event special
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                {conference.media.brochureURL && (
                  <a
                    href={conference.media.brochureURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center px-8 py-4 bg-white text-[var(--nhbea-royal-blue)] font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 hover:scale-105"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Brochure
                  </a>
                )}
                {conference.media.programURL && (
                  <a
                    href={conference.media.programURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 font-semibold rounded-xl hover:bg-white/20 transition-all duration-300"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Program
                  </a>
                )}
              </div>
                  </div>
                </Container>
              </section>
            )}
          </StandardErrorBoundary>

          {/* Enhanced Conference Sections - Story 3.4 */}
          
          {/* Speakers Section */}
          <StandardErrorBoundary>
            {conference.speakers && conference.speakers.length > 0 && (
              <SpeakersSection 
                speakers={conference.speakers}
                sessions={conference.agenda?.sessions}
                className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
              />
            )}
          </StandardErrorBoundary>

          {/* Conference Agenda */}
          <StandardErrorBoundary>
            {conference.agenda && conference.agenda.sessions.length > 0 && (
              <ConferenceAgenda 
                agenda={conference.agenda}
                speakers={conference.speakers}
                className="bg-white"
              />
            )}
          </StandardErrorBoundary>

          {/* Venue Information - Lazy Loaded */}
          <StandardErrorBoundary>
            {conference.venueDetails && (
              <Suspense fallback={<LoadingSpinner variant="section" message="Loading venue information..." />}>
                <LazyVenueInformation 
                  venue={conference.venueDetails}
                  className="bg-gradient-to-br from-blue-50 via-white to-indigo-50"
                />
              </Suspense>
            )}
          </StandardErrorBoundary>

          {/* FAQ Section - Lazy Loaded */}
          <StandardErrorBoundary>
            {conference.faqs && conference.faqs.length > 0 && (
              <Suspense fallback={<LoadingSpinner variant="section" message="Loading frequently asked questions..." />}>
                <LazyConferenceFAQ 
                  faqs={conference.faqs}
                  className="bg-white"
                />
              </Suspense>
            )}
          </StandardErrorBoundary>

          {/* Social Media Feed - Lazy Loaded */}
          <StandardErrorBoundary>
            {conference.socialMedia && (
              <Suspense fallback={<LoadingSpinner variant="section" message="Loading social media feed..." />}>
                <LazySocialMediaFeed 
                  config={conference.socialMedia}
                  className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
                />
              </Suspense>
            )}
          </StandardErrorBoundary>

          {/* Final Call to Action */}
          <StandardErrorBoundary>
            <section className="relative z-10 py-20 bg-gradient-to-br from-[var(--nhbea-royal-blue)] to-[var(--nhbea-royal-blue-dark)]">
              <Container size="xl" className="text-center">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Don't Miss Out on This Opportunity
                  </h2>
                  <p className="text-xl text-white/90 mb-8 leading-relaxed">
                    Join New Hampshire's most impactful business education conference. Transform your teaching, expand your network, and advance your career.
                  </p>
                  
                  {availability.spotsRemaining > 0 && availability.spotsRemaining <= 10 && (
                    <div className="mb-8">
                      <div className="inline-flex items-center px-6 py-3 bg-orange-100/90 backdrop-blur-sm rounded-full border border-orange-200/50 shadow-lg">
                        <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse mr-3"></div>
                        <span className="text-orange-700 font-bold text-lg">
                          ⚡ Only {availability.spotsRemaining} spots remaining! ⚡
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-lg mx-auto">
                    {availability.isAvailable ? (
                      <Link href="/conference/register">
                        <Button className="group relative px-12 py-5 bg-white text-[var(--nhbea-royal-blue)] font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                          <span className="relative z-10 flex items-center justify-center">
                            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            Register Today
                          </span>
                        </Button>
                      </Link>
                    ) : (
                      <Button disabled className="px-12 py-5 bg-gray-400 text-white font-bold text-xl rounded-2xl w-full sm:w-auto opacity-60">
                        Registration Unavailable
                      </Button>
                    )}
                    
                    <Link href="/">
                      <Button className="px-8 py-5 bg-white/20 backdrop-blur-sm text-white font-semibold text-lg rounded-2xl border border-white/30 hover:bg-white/30 hover:shadow-lg transition-all duration-300 w-full sm:w-auto">
                        Learn More About NHBEA
                      </Button>
                    </Link>
                  </div>
                </div>
              </Container>
            </section>
          </StandardErrorBoundary>
        </StandardPageLayout>
      </ConferenceThemeProvider>
    </>
  );
}