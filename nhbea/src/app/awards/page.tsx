import { Suspense, lazy } from 'react';
import Link from 'next/link';
import { StandardPageLayout } from '@/components/StandardPageLayout';
import { FlexibleHero } from '@/components/FlexibleHero';
import { LoadingSpinner, LoadingSkeleton } from '@/components/LoadingSpinner';
import { StandardErrorBoundary } from '@/components/StandardErrorBoundary';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import EnhancedAwardsGrid from '@/components/EnhancedAwardsGrid';
import { awardsRepository, awardsUtils } from '@/lib/awards';
import type { Award } from '@/types/dataModels';

// Lazy load non-critical sections for better performance
const RecognitionShowcaseSection = lazy(() => import('@/components/RecognitionShowcaseSection'));
const AwardsCallToActionSection = lazy(() => import('@/components/AwardsCallToActionSection'));

/**
 * Awards Display Page Component
 * Shows all available NHBEA awards with descriptions, eligibility, and nomination links
 */
async function AwardsPageContent() {
  let awards: Award[] = [];
  let error: string | null = null;

  try {
    awards = await awardsRepository.getAllAwards();
  } catch (err) {
    console.error('Failed to load awards:', err);
    error = 'Unable to load awards data. Please try again later.';
  }

  // Error state - aligned with brand standards
  if (error) {
    return (
      <StandardPageLayout
        hero={{
          component: FlexibleHero,
          props: {
            variant: 'awards' as const,
            title: 'Unable to Load Awards',
            subtitle: error
          }
        }}
        error={{ boundary: true }}
        loading={{ enabled: true }}
        meta={{
          title: 'Awards Error - NHBEA',
          description: 'Unable to load awards data',
          openGraph: true,
          twitterCard: true
        }}
      >
        <ResponsiveGrid 
          gap="lg" 
          breakpoints={{ mobile: 1, tablet: 1, desktop: 1, wide: 1 }}
          className="py-16 text-center"
        >
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-[var(--nhbea-accent-orange)] to-[var(--nhbea-accent-orange-dark)] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <p className="text-lg text-[var(--color-text-secondary)] mb-8">
              We're having trouble loading the awards information. Please try refreshing the page or check back later.
            </p>
            <Link 
              href="/"
              className="inline-block px-8 py-4 bg-gradient-to-r from-[var(--nhbea-accent-orange)] to-[var(--nhbea-accent-orange-dark)] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Return Home
            </Link>
          </div>
        </ResponsiveGrid>
      </StandardPageLayout>
    );
  }

  // Empty state - aligned with brand standards
  if (awards.length === 0) {
    return (
      <StandardPageLayout
        hero={{
          component: FlexibleHero,
          props: {
            variant: 'awards' as const,
            title: 'NHBEA Awards',
            subtitle: 'Celebrating excellence in business education'
          }
        }}
        error={{ boundary: true }}
        loading={{ enabled: true }}
        meta={{
          title: 'Awards - NHBEA',
          description: 'NHBEA Awards and Recognition Program',
          openGraph: true,
          twitterCard: true
        }}
      >
        <ResponsiveGrid 
          gap="lg" 
          breakpoints={{ mobile: 1, tablet: 1, desktop: 1, wide: 1 }}
          className="py-16 text-center"
        >
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-[var(--nhbea-academic-gold)] to-[var(--nhbea-academic-gold-dark)] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-lg text-[var(--color-text-secondary)] mb-4">
              No awards have been configured yet.
            </p>
            <p className="text-[var(--color-text-tertiary)] mb-8">
              Please check back later or contact us for more information.
            </p>
            <Link 
              href="/"
              className="inline-block px-8 py-4 bg-gradient-to-r from-[var(--nhbea-accent-orange)] to-[var(--nhbea-accent-orange-dark)] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Return Home
            </Link>
          </div>
        </ResponsiveGrid>
      </StandardPageLayout>
    );
  }

  // Group awards by category
  const awardsByCategory = awards.reduce((acc, award) => {
    if (!acc[award.category]) {
      acc[award.category] = [];
    }
    acc[award.category].push(award);
    return acc;
  }, {} as Record<string, Award[]>);

  // Main awards page with brand-aligned layout
  return (
    <StandardPageLayout
      hero={{
        component: FlexibleHero,
        props: {
          variant: 'awards' as const,
          activeAwards: awards.length,
          nominationDeadline: undefined // Could be calculated from awards data
        }
      }}
      error={{ boundary: true }}
      loading={{ enabled: true }}
      meta={{
        title: 'Awards & Recognition - NHBEA',
        description: 'Recognizing excellence in business education. Nominate deserving colleagues who have made significant contributions to the field.',
        openGraph: true,
        twitterCard: true
      }}
    >
      <ResponsiveGrid 
        gap="lg" 
        breakpoints={{ mobile: 1, tablet: 1, desktop: 1, wide: 1 }}
        className="space-y-16"
      >
        <StandardErrorBoundary>
          <Suspense fallback={<LoadingSkeleton variant="content" />}>
            <RecognitionShowcaseSection />
          </Suspense>
        </StandardErrorBoundary>

        <StandardErrorBoundary>
          <section id="available-awards" className="py-16 lg:py-24 relative overflow-hidden bg-gradient-to-br from-[var(--color-bg-primary)] via-white to-[var(--nhbea-royal-blue-subtle)]/10">
            {/* Background decorative elements - aligned with brand */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
              <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-[var(--nhbea-royal-blue)]/20 to-transparent rounded-full animate-pulse delay-300"></div>
              <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-gradient-to-br from-[var(--nhbea-academic-gold)]/20 to-transparent rounded-full animate-pulse delay-700"></div>
            </div>
            
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
              {/* Enhanced section header with better UX messaging */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-4 py-2 bg-[var(--nhbea-royal-blue)]/10 rounded-full mb-6">
                  <div className="w-2 h-2 bg-[var(--nhbea-royal-blue)] rounded-full mr-2 animate-pulse"></div>
                  <span className="text-[var(--nhbea-royal-blue)] font-semibold text-sm tracking-wide uppercase">Award Categories</span>
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-[var(--color-text-primary)]">
                  <span className="bg-gradient-to-r from-[var(--nhbea-royal-blue)] via-[var(--nhbea-royal-blue-dark)] to-[var(--nhbea-royal-blue-deeper)] bg-clip-text text-transparent">
                    Choose an Award to Nominate For
                  </span>
                </h2>
                <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto leading-relaxed mb-8">
                  Select the category that best fits your nominee's achievements. Each award recognizes different aspects of educational excellence.
                </p>
                
                {/* Quick navigation for busy users */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {Object.keys(awardsByCategory).map((category) => (
                    <a
                      key={category}
                      href={`#category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                      className="px-4 py-2 bg-white/80 backdrop-blur-sm text-[var(--nhbea-royal-blue)] font-medium rounded-full border border-[var(--nhbea-royal-blue)]/20 hover:bg-[var(--nhbea-royal-blue)]/10 hover:border-[var(--nhbea-royal-blue)]/40 transition-all duration-300 scroll-smooth"
                    >
                      {awardsUtils.formatCategory(category as Award['category'])}
                    </a>
                  ))}
                </div>
                
                <div className="w-24 h-1 bg-gradient-to-r from-[var(--nhbea-royal-blue)] to-[var(--nhbea-royal-blue-dark)] rounded-full mx-auto"></div>
              </div>

              <EnhancedAwardsGrid awardsByCategory={awardsByCategory} />
            </div>
          </section>
        </StandardErrorBoundary>

        <StandardErrorBoundary>
          <Suspense fallback={<LoadingSkeleton variant="content" />}>
            <AwardsCallToActionSection />
          </Suspense>
        </StandardErrorBoundary>
      </ResponsiveGrid>
    </StandardPageLayout>
  );
}

/**
 * Main Awards Page Export
 * Uses Suspense for optimized loading experience
 */
export default function AwardsPage() {
  return (
    <Suspense fallback={<LoadingSpinner variant="page" message="Loading awards..." />}>
      <AwardsPageContent />
    </Suspense>
  );
}