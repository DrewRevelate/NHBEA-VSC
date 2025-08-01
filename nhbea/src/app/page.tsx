import { Suspense, lazy } from 'react';
import { StandardPageLayout } from '@/components/StandardPageLayout';
import { FlexibleHero } from '@/components/FlexibleHero';
import { LoadingSpinner, LoadingSkeleton } from '@/components/LoadingSpinner';
import { StandardErrorBoundary } from '@/components/StandardErrorBoundary';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { StructuredData } from '@/components/StructuredData';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import MembershipBenefitsHighlight from '@/components/MembershipBenefitsHighlight';
import EnhancedMissionSection from '@/components/EnhancedMissionSection';
import EnhancedAboutSection from '@/components/EnhancedAboutSection';
import { getHomepageContent, defaultHomepageContent } from '@/lib/content';

// Lazy load non-critical sections for better performance
const TrustBadgesSection = lazy(() => import('@/components/TrustBadgesSection'));
const NewsletterSignup = lazy(() => import('@/components/NewsletterSignup'));
const SocialProofSection = lazy(() => import('@/components/SocialProofSection'));


async function HomePage() {
  let homepageContent = defaultHomepageContent;
  let contentError = null;

  try {
    const fetchedContent = await getHomepageContent();
    if (fetchedContent) {
      homepageContent = fetchedContent;
    }
  } catch (error) {
    contentError = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to fetch homepage content:', error);
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
      {/* SEO Structured Data */}
      <StructuredData type="membership" data={{}} />
      <StructuredData type="awards" data={{}} />
      
      <ResponsiveGrid 
        gap="lg" 
        breakpoints={{ mobile: 1, tablet: 1, desktop: 1, wide: 1 }}
        className="space-y-16"
      >
        <StandardErrorBoundary>
          <TestimonialsCarousel />
        </StandardErrorBoundary>
        
        <StandardErrorBoundary>
          <MembershipBenefitsHighlight />
        </StandardErrorBoundary>
        
        <StandardErrorBoundary>
          <Suspense fallback={<LoadingSkeleton variant="content" />}>
            <TrustBadgesSection />
          </Suspense>
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
            <SocialProofSection />
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
