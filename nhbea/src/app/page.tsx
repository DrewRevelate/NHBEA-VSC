import { Suspense, lazy } from 'react';
import { StandardPageLayout } from '@/components/StandardPageLayout';
import { FlexibleHero } from '@/components/FlexibleHero';
import { LoadingSpinner, LoadingSkeleton } from '@/components/LoadingSpinner';
import { StandardErrorBoundary } from '@/components/StandardErrorBoundary';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import StatisticsSection from '@/components/StatisticsSection';
import EnhancedMissionSection from '@/components/EnhancedMissionSection';
import EnhancedAboutSection from '@/components/EnhancedAboutSection';
import { getHomepageContent, defaultHomepageContent } from '@/lib/content';
import { getSponsors, defaultSponsors } from '@/lib/sponsors';

// Lazy load non-critical sections for better performance
const TrustBadgesSection = lazy(() => import('@/components/TrustBadgesSection'));
const SponsorsSection = lazy(() => import('@/components/SponsorsSection'));
const NewsletterSignup = lazy(() => import('@/components/NewsletterSignup'));


async function HomePage() {
  let homepageContent = defaultHomepageContent;
  let sponsors = defaultSponsors;
  let contentError = null;
  let sponsorsError = null;

  try {
    const fetchedContent = await getHomepageContent();
    if (fetchedContent) {
      homepageContent = fetchedContent;
    }
  } catch (error) {
    contentError = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to fetch homepage content:', error);
  }

  try {
    sponsors = await getSponsors();
  } catch (error) {
    sponsorsError = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to fetch sponsors:', error);
  }

  // Ensure we always have valid content with all required fields
  const safeContent = homepageContent ? {
    ...defaultHomepageContent,
    ...homepageContent
  } : defaultHomepageContent;

  return (
    <StandardPageLayout
      hero={{
        component: FlexibleHero,
        props: {
          variant: 'home' as const,
          content: safeContent
        }
      }}
      error={{ boundary: true }}
      loading={{ enabled: true }}
      meta={{
        title: 'New Hampshire Business Educators Association - NHBEA',
        description: safeContent.heroSubtitle || 'Promoting excellence in business education throughout New Hampshire through professional development, networking, and career advancement opportunities.',
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
          <StatisticsSection />
        </StandardErrorBoundary>
        
        <StandardErrorBoundary>
          <EnhancedMissionSection
            title={safeContent.missionTitle}
            content={safeContent.missionContent}
          />
        </StandardErrorBoundary>
        
        <StandardErrorBoundary>
          <EnhancedAboutSection
            title={safeContent.aboutTitle}
            content={safeContent.aboutContent}
            imageURL={safeContent.aboutImageURL}
          />
        </StandardErrorBoundary>
        
        <StandardErrorBoundary>
          <Suspense fallback={<LoadingSkeleton variant="content" />}>
            <TrustBadgesSection />
          </Suspense>
        </StandardErrorBoundary>
        
        <StandardErrorBoundary>
          <Suspense fallback={<LoadingSkeleton variant="grid" count={3} />}>
            <SponsorsSection sponsors={sponsors} />
          </Suspense>
        </StandardErrorBoundary>
        
        <StandardErrorBoundary>
          <Suspense fallback={<LoadingSkeleton variant="content" />}>
            <NewsletterSignup />
          </Suspense>
        </StandardErrorBoundary>
      </ResponsiveGrid>
    </StandardPageLayout>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner variant="page" message="Loading homepage..." />}>
      <HomePage />
    </Suspense>
  );
}
